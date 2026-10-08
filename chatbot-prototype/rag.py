"""RAG + relational router for the PoC.

answer() implements the hybrid path:
  1. intent router  ->  direct SQL into the relational store (competitors,
     client counts, deadlines) when the question matches — the LLM still only
     synthesises over the query result rows.
  2. vector RAG     ->  embed the question, cosine-search over the chunks,
     feed the top-k (score >= min_score) to the local LLM as numbered
     excerpts and require citations. If the best score is below threshold,
     answer with an explicit "evidence insufficient" statement instead.
"""
import json
import math
import re
import sqlite3
import struct
from pathlib import Path

import llmtools

BASE = Path(__file__).resolve().parent
SYSTEM_PROMPT = (
    "You are the Consilio Intelligence Gateway, a factual assistant over the firm's own "
    "knowledge base (synthetic sample data). Rules:\n"
    "- Answer ONLY from the numbered excerpts below. Never use outside knowledge.\n"
    "- Cite every factual claim with the excerpt number in brackets, e.g. [2]. "
    "Multiple citations are allowed: [1][3].\n"
    "- If the excerpts do not contain enough information to answer, say exactly: "
    '\"I do not have enough evidence in the knowledge base to answer this.\" and briefly '
    "state what information is missing.\n"
    "- Never fabricate citations, numbers, or sources. Figures in the excerpts are "
    "synthetic planning data and must not be presented as real company figures.\n"
    "- Be concise: answer directly, then support the claims with citations."
)

RELATIONAL_PATTERNS = [
    ("competitors", re.compile(r"competitor", re.I),
     re.compile(r"\b(top|biggest|largest|rank|revenue|how many|who)\b", re.I)),
    ("clients", re.compile(r"client", re.I),
     re.compile(r"\b(how many|count|number of|by sector|across)\b", re.I)),
    ("deadlines", re.compile(r"\b(due|deadline|risk|overdue|milestone|next 30|within 30|horizon)\b", re.I),
     re.compile(r".*")),
]
RELATIONAL_QUERIES = {
    "competitors": "SELECT name, revenue_usd, employees, focus FROM competitors ORDER BY revenue_usd DESC",
    "clients": "SELECT sector, COUNT(*) AS n, SUM(arr_usd) AS arr FROM clients GROUP BY sector ORDER BY n DESC",
    "deadlines": (
        "SELECT matter, milestone, due, status, risk FROM deadlines "
        "WHERE due BETWEEN date('now', 'localtime') AND date('now', 'localtime', '+30 days') ORDER BY due"
    ),
}


class State:
    def __init__(self, cfg):
        self.cfg = cfg
        self.db_path = BASE / cfg["db"]
        self.chunks = []          # list of dicts: {id, doc_id, title, dimension, score, text}
        self.index = []           # normalized float vectors, aligned with self.chunks
        self._load_index()

    def _load_index(self):
        # PoC-scale only: loads all chunks + embeddings into memory.
        # For production, replace with a real vector DB (Qdrant/Chroma/pgvector)
        # and push search server-side.
        con = sqlite3.connect(self.db_path)
        rows = con.execute(
            """
            SELECT c.id, c.doc_id, d.title, d.dimension, c.text, c.embedding
            FROM chunks c JOIN documents d ON d.id = c.doc_id
            ORDER BY c.doc_id, c.seq
            """
        ).fetchall()
        con.close()
        for cid, doc_id, title, dimension, text, blob in rows:
            vec = struct.unpack(f"<{len(blob)//4}f", blob)
            norm = math.sqrt(sum(x * x for x in vec)) or 1.0
            self.chunks.append(
                {"id": cid, "doc_id": doc_id, "title": title,
                 "dimension": dimension, "text": text})
            self.index.append([x / norm for x in vec])

    def _embed_query(self, text):
        base = self.cfg["embed"]["base_url"]
        model = self.cfg["embed"]["model"]
        vec = llmtools.embed_texts(base, model, [text])[0]
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [x / norm for x in vec]

    def _search(self, query_vec, k):
        scored = []
        for i, v in enumerate(self.index):
            score = sum(a * b for a, b in zip(query_vec, v))
            scored.append((score, i))
        scored.sort(reverse=True, key=lambda t: t[0])
        top = []
        for score, i in scored[:k]:
            item = dict(self.chunks[i])
            item["score"] = score
            top.append(item)
        return top

    def _run_relational(self, kind):
        con = sqlite3.connect(self.db_path)
        rows = con.execute(RELATIONAL_QUERIES[kind]).fetchall()
        con.close()
        if kind == "competitors":
            lines = []
            for name, rev, emp, focus in rows:
                lines.append(f"{name} — revenue ${rev/1e6:.1f}M, {emp} employees, focus: {focus}")
            return "Live relational query — competitor standings (synthetic):\n" + "\n".join(lines)
        if kind == "clients":
            if not rows:
                return "Live relational query — client counts by sector (synthetic): no rows."
            lines = [f"{sector}: {n} clients, combined ARR ${arr/1e6:.1f}M" for sector, n, arr in rows]
            return "Live relational query — client counts by sector (synthetic):\n" + "\n".join(lines)
        # deadlines
        if not rows:
            return "Live relational query — deadlines in the next 30 days (synthetic): no items due."
        lines = [f"{matter} — {milestone} due {due} ({status}, risk {risk})" for matter, milestone, due, status, risk in rows]
        return "Live relational query — milestones due within 30 days (synthetic):\n" + "\n".join(lines)

    def _detect_intent(self, question):
        q = question.lower()
        for kind, any_re, must_re in RELATIONAL_PATTERNS:
            if any_re.search(q) and must_re.search(q):
                return kind
        return None

    def _llm_answer(self, context_label, excerpts, question, usage_accum):
        user = (
            f"{context_label}\n\nEXCERPTS:\n"
            + "\n".join(f"[{n}] {c}" for n, c in enumerate(excerpts, 1))
            + f"\n\nQUESTION: {question}"
        )
        cfg = self.cfg["llm"]
        text, usage = llmtools.chat(
            cfg["base_url"], cfg["model"],
            [{"role": "system", "content": SYSTEM_PROMPT},
             {"role": "user", "content": user}],
            temperature=cfg.get("temperature", 0.3),
            max_tokens=cfg.get("max_tokens", 640),
        )
        usage_accum["prompt"] += usage.get("prompt_tokens", 0)
        usage_accum["completion"] += usage.get("completion_tokens", 0)
        return text

    def answer(self, question):
        cfg = self.cfg
        usage = {"prompt": 0, "completion": 0}
        intent = self._detect_intent(question)
        if intent:
            context = self._run_relational(intent)
            answer = self._llm_answer(
                context_label="The assistant queried the relational store directly "
                              "(no document search needed for this structured question).",
                excerpts=[context],
                question=question,
                usage_accum=usage,
            )
            return {
                "mode": "relational",
                "answer": answer,
                "sources": [{"title": "Live relational query", "dimension": intent,
                             "score": 1.0, "snippet": "Structured data from the matter-management SQLite store"}],
                "usage": usage,
                "intent": intent,
            }

        query_vec = self._embed_query(question)
        top = self._search(query_vec, cfg["retrieval"]["top_k"])
        best = top[0]["score"] if top else 0.0
        min_score = cfg["retrieval"]["min_score"]

        if not top or best < min_score:
            evidence = top[0] if top else None
            return {
                "mode": "insufficient",
                "answer": "I don't have enough information in the knowledge base to answer that question.",
                "sources": [],
                "usage": usage,
                "debug": {
                    "reason": "below_threshold" if top else "no_matches",
                    "best_score": round(evidence["score"], 3) if evidence else 0.0,
                    "best_title": evidence["title"] if evidence else None,
                    "threshold": min_score,
                },
            }

        answer = self._llm_answer(
            context_label="The assistant retrieved the following excerpts from the knowledge base.",
            excerpts=[c["text"] for c in top],
            question=question,
            usage_accum=usage,
        )
        # A model-declared refusal is the "explicit evidence-insufficient
        # statement"; surface it with the amber badge like a gated answer.
        if "I do not have enough evidence" in answer:
            return {
                "mode": "insufficient",
                "answer": "I don't have enough information in the knowledge base to answer that question.",
                "sources": [],
                "usage": usage,
                "debug": {"reason": "model_refusal"},
            }
        # PoC: top_k <= 6, so 1-2 digit citations are fine. For scale, use a more robust parser.
        refs = sorted({int(m) for m in re.findall(r"\[(\d{1,2})\]", answer)})
        sources = []
        for n in refs:
            if 1 <= n <= len(top):
                c = top[n - 1]
                sources.append({
                    "title": c["title"], "dimension": c["dimension"],
                    "score": c["score"],
                    "snippet": " ".join(c["text"].split()[:60]),
                })
        return {"mode": "rag", "answer": answer, "sources": sources, "usage": usage}
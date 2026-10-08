"""Build the PoC knowledge store from corpus/*.md and corpus/data.json.

Usage:  python ingest.py [--config config.json]

Run on the demo machine: embeddings are computed against the local
OpenAI-compatible endpoint (Ollama or llama-server). Re-running rebuilds
the SQLite database from scratch, so ingest is idempotent.

Databases created (data/chatprototype.sqlite):
  documents  - one row per corpus file (title, dimension, source, body)
  chunks     - embedded text chunks (one row per chunk, embedding BLOB)
  competitors, clients, deadlines - relational tables from corpus/data.json
"""
import argparse
import json
import re
import sqlite3
import struct
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import llmtools

FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)
HEADING_RE = re.compile(r"^#{1,3} .*$", re.M)


def parse_doc(path: Path):
    raw = path.read_text(encoding="utf-8")
    meta = {}
    body = raw
    m = FRONT_MATTER_RE.match(raw)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line and not line.lstrip().startswith("#"):
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = raw[m.end():]
    return {
        "title": meta.get("title", path.stem),
        "dimension": meta.get("dimension", "general"),
        "synthetic": meta.get("synthetic", "true").lower() in ("1", "true", "yes"),
        "source": path.name,
        "body": body.strip(),
    }


def chunk_markdown(body: str, max_words: int, overlap_words: int):
    """Split a markdown body into chunks bounded by headings and word count."""
    parts = re.split(r"(?m)^(#{1,3} .*)$", body)
    sections, cur = [], ""
    for part in parts:
        if re.match(r"#{1,3} ", part.strip()):
            if cur.strip():
                sections.append(cur.strip())
            cur = part + "\n"
        else:
            cur += part
    if cur.strip():
        sections.append(cur.strip())

    chunks = []
    for section in sections:
        words = section.split()
        if len(words) <= max_words:
            chunks.append(section)
            continue
        i = 0
        while i < len(words):
            end = min(i + max_words, len(words))
            chunks.append(" ".join(words[i:end]))
            if end == len(words):
                break
            i = end - overlap_words
    return chunks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="config.json")
    args = ap.parse_args()

    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    base = Path(__file__).resolve().parent
    corpus_dir = base / cfg["corpus"]
    db_path = base / cfg["db"]
    db_path.parent.mkdir(parents=True, exist_ok=True)

    embed_base = cfg["embed"]["base_url"]
    embed_model = cfg["embed"]["model"]
    max_words = cfg["retrieval"]["chunk_words"]
    overlap = cfg["retrieval"]["overlap_words"]

    # Safety: never wipe an existing store if the embedding endpoint is
    # unreachable (e.g. wrong profile for this machine).
    try:
        probe = llmtools.embed_texts(embed_base, embed_model, ["ping"], timeout=30)
        if not probe:
            sys.exit("embedding endpoint returned no vectors; aborting")
    except Exception as exc:
        sys.exit(f"embedding endpoint {embed_base} unreachable ({exc}); "
                 "not touching the existing store — check which --config profile is right for this machine")

    # Atomic write: build to temp file, then replace on success.
    tmp_path = db_path.with_suffix(".sqlite.new")
    if tmp_path.exists():
        tmp_path.unlink()
    con = sqlite3.connect(tmp_path)
    cur = con.cursor()
    cur.executescript(
        """
        CREATE TABLE documents(id INTEGER PRIMARY KEY, title TEXT, dimension TEXT,
                               source TEXT, synthetic INTEGER, body TEXT);
        CREATE TABLE chunks(id INTEGER PRIMARY KEY, doc_id INTEGER, seq INTEGER,
                            text TEXT, tokens INTEGER, embedding BLOB);
        CREATE INDEX idx_chunks_doc ON chunks(doc_id);
        CREATE TABLE competitors(name TEXT, revenue_usd INTEGER, employees INTEGER,
                                 focus TEXT, founded INTEGER);
        CREATE TABLE clients(name TEXT, sector TEXT, matters INTEGER, arr_usd INTEGER);
        CREATE TABLE deadlines(matter TEXT, milestone TEXT, due TEXT,
                               status TEXT, risk TEXT);
        """
    )

    # 1) Documents + embedded chunks
    docs = sorted(corpus_dir.glob("*.md"))
    if not docs:
        sys.exit(f"no corpus files found in {corpus_dir}")
    t0 = time.time()
    for doc_path in docs:
        doc = parse_doc(doc_path)
        cur.execute(
            "INSERT INTO documents(title, dimension, source, synthetic, body) VALUES (?,?,?,?,?)",
            (doc["title"], doc["dimension"], doc["source"], int(doc["synthetic"]), doc["body"]),
        )
        doc_id = cur.lastrowid
        chunks = chunk_markdown(doc["body"], max_words, overlap)
        for seq, text in enumerate(chunks):
            # embed one at a time; corpora are tiny and this keeps memory flat
            vec = llmtools.embed_texts(embed_base, embed_model, [text])[0]
            packed = struct.pack(f"<{len(vec)}f", *vec)
            cur.execute(
                "INSERT INTO chunks(doc_id, seq, text, tokens, embedding) VALUES (?,?,?,?,?)",
                (doc_id, seq, text, max(1, len(text.split())), packed),
            )
        print(f"  [ingest] {doc['source']}: {len(chunks)} chunks", flush=True)

    # 2) Relational tables from corpus/data.json
    tables = ("competitors", "clients", "deadlines")
    data_json = corpus_dir / "data.json"
    if data_json.exists():
        facts = json.loads(data_json.read_text(encoding="utf-8"))
        for table in tables:
            rows = facts.get(table, [])
            if rows:
                cols = ",".join(rows[0].keys())
                placeholders = ",".join("?" * len(rows[0]))
                cur.executemany(
                    f"INSERT INTO {table}({cols}) VALUES ({placeholders})",
                    [tuple(r.values()) for r in rows],
                )
                print(f"  [ingest] {table}: {len(rows)} rows", flush=True)

    con.commit()
    n_docs = cur.execute("SELECT COUNT(*) FROM documents").fetchone()[0]
    n_chunks = cur.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    con.close()
    # Atomic replace
    tmp_path.replace(db_path)
    print(f"done in {time.time()-t0:.1f}s  ->  {n_docs} docs, {n_chunks} chunks @ {db_path}")


if __name__ == "__main__":
    main()
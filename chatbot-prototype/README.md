# Consilio Intelligence Gateway — PoC prototype

A working vertical slice of the chat feature over a **synthetic knowledge base**,
run entirely on a local machine with an open-weight LLM. Built for the proof of
concept demo.

## What it demonstrates

- **RAG-only answer path** — every answer is synthesised by the local LLM over
  retrieved, validated context; nothing is fetched live from the web.
- **Citations** — the LLM is instructed to cite `[n]` excerpts; the UI renders
  the cited sources with titles, dimension and match score. No context above
  the confidence threshold ⇒ an explicit **"evidence insufficient"** answer.
- **Hybrid router** — structured questions ("top competitors by revenue",
  "deadlines due in 30 days") short-circuit to direct SQL in the relational
  store; the LLM still only summarises the query result rows.
- **All data in a database** — SQLite file built from `corpus/` at ingest time;
  the frontend contains zero data. Everything is flagged **synthetic** in the UI.
- **Local first** — OpenAI-compatible endpoints, so the same code runs against
  Ollama (work laptop) or `llama.cpp`'s `llama-server` (dev box) with a config
  switch. Nothing leaves the machine.

## Layout

```
prototype/
  corpus/            synthetic docs (five dimensions) + data.json (relational facts)
  ingest.py          chunk + embed -> SQLite (documents, chunks, competitors, clients, deadlines)
  rag.py             router + retrieval + prompt + citations
  server.py          stdlib HTTP server, serves demo.html + /api/chat
  demo.html          single-file chat UI (no CDNs, no build step)
  config.json        Ollama profile (default)
  config.llamacpp.json  dev profile (llama-server)
```

## Run on the work laptop (Ollama)

1. **Models in Ollama** (already done for the chat model; add embeddings):

   ```powershell
   ollama list                        # must show qwen3-4b-local
   ollama pull qwen3-embedding:0.6b   # embeddings; registry is reachable
   ```

   Offline alternative (no registry): copy the embedding GGUF beside the chat
   GGUF and import the same way:

   ```
   FROM ./Qwen3-Embedding-0.6B-Q8_0.gguf
   ```

   saved as `Modelfile-embedding`, then `ollama create qwen3-embedding-local -f Modelfile-embedding`
   (and point `config.json` → `"model": "qwen3-embedding-local"`).

2. **Copy the `prototype/` folder** to the work laptop (flash drive / LAN, as
   you did for the GGUF).

3. **Build and serve** (from the `prototype\` folder, PowerShell):

   ```powershell
   python ingest.py        # builds data\chatprototype.sqlite (all embeddings computed locally)
   python server.py        # prints the URL
   ```

   (or double-click `run_demo.bat`).

4. Open **http://localhost:8000** and talk to it. Allow the Windows firewall
   prompt when it appears.

## Demo script (6 shots)

| Question                                       | Route                 |
| ---------------------------------------------- | --------------------- |
| Who are our top competitors by revenue?        | Direct data query     |
| Describe the eDiscovery workflow step by step. | Knowledge-base RAG    |
| What did we deliver on Matter Meridian?        | Knowledge-base RAG    |
| How are we organised into departments?         | Knowledge-base RAG    |
| Which deadlines are due in the next 30 days?   | Direct data query     |
| What is the stock price of Consilio today?     | Evidence insufficient |

## Running against llama.cpp (dev)

```bash
# terminal 1 — chat model
build/bin/llama-server -m Qwen3-4B-Instruct-2507-Q4_K_M.gguf -c 8192 --port 8080
# terminal 2 — embedding model
build/bin/llama-server -m Qwen3-Embedding-0.6B-Q8_0.gguf --embedding --pooling last -c 8192 --port 8081
# terminal 3
python ingest.py --config config.llamacpp.json
python server.py --config config.llamacpp.json
```

## Config knobs (`config.json`)

- `retrieval.min_score` — cosine threshold below which the answer becomes
  "evidence insufficient" (default 0.50). Relevant content scores ≈ 0.6–0.9 on
  the demo corpus; unrelated queries ≈ 0.3–0.45.
- `retrieval.top_k` — excerpts handed to the LLM (default 6).
- `llm.temperature` / `llm.max_tokens` — synthesis behaviour.
- `port` — demo server port.

## Troubleshooting

- **"Server error: cannot connect"** — Ollama not running, or the model name in
  `config.json` differs from `ollama list`.
- **Port busy** — change `port` in `config.json` (e.g. 8010).
- **Windows firewall** — choose "Allow access" on first run; the server binds to
  localhost only, so this is local-only traffic.
- **Re-ingest** — `ingest.py` rebuilds the SQLite store from scratch each run.

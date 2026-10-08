#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "[1/2] Building knowledge store (embeddings are computed locally)..."
python3 ingest.py
echo
echo "[2/2] Starting server - open http://localhost:8000 in your browser."
python3 server.py
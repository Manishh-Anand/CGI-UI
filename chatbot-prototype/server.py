"""PoC demo server. Serves demo.html and the /api/chat endpoint.

Usage:  python server.py [--config config.json]
Then open http://localhost:8000 in a browser.

Python stdlib only (http.server). CORS enabled so the page can also be
served from another origin (e.g. a Node-hosted UI) if desired.
"""
import argparse
import json
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE))
import rag

STATE = None
CFG = None


class Handler(BaseHTTPRequestHandler):
    server_version = "ChatPrototype/0.1"

    def _send(self, code, body, ctype="application/json"):
        data = body if isinstance(body, bytes) else body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", f"{ctype}; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        sys.stderr.write("[server] " + fmt % args + "\n")

    def do_OPTIONS(self):
        self._send(204, "")

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            html = (BASE / "demo.html").read_bytes()
            self._send(200, html, "text/html")
        elif self.path == "/health":
            self._send(200, json.dumps({
                "ok": True,
                "llm": CFG["llm"]["base_url"] + " / " + CFG["llm"]["model"],
                "embed": CFG["embed"]["base_url"] + " / " + CFG["embed"]["model"],
                "disclaimer": CFG["disclaimer"],
            }))
        else:
            self._send(404, json.dumps({"error": "not found"}))

    def do_POST(self):
        if self.path != "/api/chat":
            self._send(404, json.dumps({"error": "not found"}))
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            question = (body.get("question") or "").strip()
            if not question:
                self._send(400, json.dumps({"error": "empty question"}))
                return
            t0 = time.time()
            result = STATE.answer(question)
            elapsed = time.time() - t0
            result["question"] = question
            result["disclaimer"] = CFG["disclaimer"]
            result["model"] = CFG["llm"]["model"]
            result["embed_model"] = CFG["embed"]["model"]
            result["total_seconds"] = round(elapsed, 1)
            self._send(200, json.dumps(result))
        except Exception as exc:  # surface errors to the UI for demo debugging
            self._send(500, json.dumps({"error": str(exc)}))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="config.json")
    args = ap.parse_args()
    global CFG, STATE
    CFG = json.loads((BASE / args.config).read_text(encoding="utf-8"))
    STATE = rag.State(CFG)
    port = int(CFG.get("port", 8000))
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("=" * 60)
    print("  Consilio Intelligence Gateway — PoC chat server")
    print(f"  Open:  http://localhost:{port}")
    print(f"  LLM:   {CFG['llm']['base_url']}  /  {CFG['llm']['model']}")
    print(f"  Embed: {CFG['embed']['base_url']}  /  {CFG['embed']['model']}")
    print(f"  DB:    {STATE.db_path}")
    print("=" * 60, flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nbye")
        httpd.server_close()


if __name__ == "__main__":
    main()
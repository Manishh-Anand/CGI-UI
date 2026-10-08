"""Tiny OpenAI-compatible client helpers. Python stdlib only — no pip needed."""
import json
import urllib.request


def post_json(url, payload, timeout=900):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        if resp.getcode() >= 400:
            raise RuntimeError(f"HTTP {resp.getcode()}: {resp.read().decode()}")
        return json.loads(resp.read().decode("utf-8"))


def embed_texts(base_url, model, texts, timeout=900):
    """Embed a list of strings via OpenAI-compatible /v1/embeddings.

    Works against both Ollama (http://localhost:11434/v1) and
    llama.cpp's llama-server (http://localhost:8080/v1).
    """
    payload = {"model": model, "input": texts}
    data = post_json(base_url.rstrip("/") + "/embeddings", payload, timeout=timeout)
    return [item["embedding"] for item in data["data"]]


def chat(base_url, model, messages, temperature=0.3, max_tokens=640, timeout=900):
    """Non-streaming chat completion. Returns (text, usage-dict)."""
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False,
    }
    data = post_json(base_url.rstrip("/") + "/chat/completions", payload, timeout=timeout)
    choice = data["choices"][0]
    return choice["message"]["content"], data.get("usage", {})
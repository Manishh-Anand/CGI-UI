@echo off
setlocal
cd /d "%~dp0"
echo [1/2] Building knowledge store (embeddings are computed locally)...
python ingest.py
if errorlevel 1 goto :err
echo.
echo [2/2] Starting server - open http://localhost:8000 in your browser.
python server.py
goto :eof
:err
echo.
echo Ingest failed. Is Ollama running and the model installed?
pause
#!/usr/bin/env bash
# ==============================================================================
# Cyber Security CLI Lab - Linux / macOS Launcher Script
# ==============================================================================

PORT=8085
URL="http://localhost:$PORT"

echo "===================================================================="
echo "      🛡️ CYBER SECURITY CLI LAB - STARTING LOCAL SERVER 🛡️         "
echo "===================================================================="

# Check if Python is installed
if command -v python3 &>/dev/null; then
    echo "[+] Starting server via Python 3 on $URL..."
    # Open browser based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$URL" &
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$URL" &>/dev/null &
    fi
    python3 -m http.server $PORT
elif command -v python &>/dev/null; then
    echo "[+] Starting server via Python on $URL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$URL" &
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$URL" &>/dev/null &
    fi
    python -m http.server $PORT
elif command -v npx &>/dev/null; then
    echo "[+] Starting server via npx serve on $URL..."
    npx -y serve -l $PORT .
else
    echo "[-] Neither Python nor Node/npx was found on your system."
    echo "[*] You can still open 'index.html' directly in any modern web browser!"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open index.html &>/dev/null
    fi
fi

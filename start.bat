@echo off
echo ===================================================
echo     CYBER SECURITY CLI LAB - STARTING SERVER
echo ===================================================
echo Opening lab in default web browser...
start http://localhost:8085
python -m http.server 8085
pause

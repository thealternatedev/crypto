@echo off

call pkg --out-path output .
call node place_icon.js output/crypto-win.exe

exit /b 0
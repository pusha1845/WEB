@echo off
setlocal
title Next.js - Lab 3 - Variant 5
cd /d "%~dp0project"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 24 LTS from https://nodejs.org/ and reopen this file.
  pause
  exit /b 1
)
node -e "const v=Number(process.versions.node.split('.')[0]); process.exit(v === 22 || v === 24 ? 0 : 1)"
if errorlevel 1 (
  echo Node.js 22 or 24 is required. Recommended: Node.js 24 LTS.
  pause
  exit /b 1
)
if not exist node_modules\next\package.json (
  echo Installing dependencies. Internet connection is required on first launch.
  call npm.cmd ci
  if errorlevel 1 goto failed
)
echo Open http://localhost:3000 in your browser.
echo Keep this window open. Press Ctrl+C to stop the server.
start "" "http://localhost:3000"
call npm.cmd run dev -- --port 3000
if errorlevel 1 goto failed
exit /b 0
:failed
echo Launch failed. Check the error above, Node.js version and available port 3000.
pause
exit /b 1

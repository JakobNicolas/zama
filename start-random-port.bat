@echo off
chcp 65001 >nul
title 启动FHE DApp - 随机端口
color 0A

echo.
echo ==========================================
echo    🚀 FHE DApp 随机端口启动器
echo ==========================================
echo.

cd /d "%~dp0"

if not exist "frontend\node_modules" (
    echo 📦 检测到缺少依赖，正在安装...
    cd frontend
    call npm install
    cd ..
)

echo 🔍 正在寻找可用端口并启动前端...
node start-random-port.js

pause
@echo off
chcp 65001 >nul
title FHE DApp - 智能端口启动
color 0B

echo.
echo =======================================
echo     🚀 FHE DApp 智能启动器  
echo =======================================
echo.

cd /d "D:\web3\dapp2\frontend"

REM 检查依赖
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call npm install
)

REM 使用PowerShell查找可用端口
for %%p in (3001 3005 3008 8080 9000 3010) do (
    powershell -Command "try { $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, %%p); $listener.Start(); $listener.Stop(); exit 0 } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 (
        echo ✅ 找到可用端口: %%p
        echo 🌐 前端将在 http://localhost:%%p 启动
        echo.
        
        set PORT=%%p
        set BROWSER=none
        set SKIP_PREFLIGHT_CHECK=true
        set DANGEROUSLY_DISABLE_HOST_CHECK=true
        set GENERATE_SOURCEMAP=false
        
        REM 延迟3秒后打开浏览器
        start /min powershell -Command "Start-Sleep 3; Start-Process 'http://localhost:%%p'"
        
        call npm start
        goto :end
    )
)

echo ❌ 所有预设端口都被占用，使用系统分配的随机端口...
set PORT=0
call npm start

:end
echo.
echo 👋 前端服务已停止
pause
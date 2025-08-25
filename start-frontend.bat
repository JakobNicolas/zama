@echo off
chcp 65001 >nul
title FHE DApp - 随机端口启动
color 0B

echo.
echo =======================================
echo     🚀 FHE DApp 前端启动器
echo =======================================
echo.

cd /d "D:\web3\dapp2\frontend"

REM 检查依赖
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

REM 查找可用端口并启动
for %%p in (3001 3005 8080 9000 3010 3020 3030) do (
    netstat -an | find "LISTENING" | find ":%%p " >nul
    if errorlevel 1 (
        echo ✅ 端口 %%p 可用
        echo 🚀 启动前端在端口 %%p...
        echo 🌐 访问地址: http://localhost:%%p
        echo.
        
        set PORT=%%p
        set BROWSER=none
        set SKIP_PREFLIGHT_CHECK=true
        set DANGEROUSLY_DISABLE_HOST_CHECK=true
        set GENERATE_SOURCEMAP=false
        set TSC_COMPILE_ON_ERROR=true
        set ESLINT_NO_DEV_ERRORS=true
        
        start "" "http://localhost:%%p"
        
        call npm start
        goto :end
    )
)

echo ❌ 未找到可用端口，尝试使用随机端口...
node ../quick-start.js

:end
pause
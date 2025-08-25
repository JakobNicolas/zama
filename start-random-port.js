const { spawn } = require('child_process');
const net = require('net');

// 查找可用端口的函数
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });
  });
}

// 启动前端服务的主函数
async function startFrontend() {
  try {
    // 查找可用端口
    const port = await findAvailablePort();
    console.log(`🚀 找到可用端口: ${port}`);
    console.log(`🌐 前端将在 http://localhost:${port} 启动`);
    
    // 设置环境变量
    const env = {
      ...process.env,
      PORT: port.toString(),
      BROWSER: 'none', // 防止自动打开浏览器
      SKIP_PREFLIGHT_CHECK: 'true',
      DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
      GENERATE_SOURCEMAP: 'false'
    };
    
    // 启动React开发服务器
    const child = spawn('npm', ['start'], {
      cwd: './frontend',
      env: env,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('error', (error) => {
      console.error('❌ 启动失败:', error.message);
    });
    
    child.on('close', (code) => {
      console.log(`📱 前端服务已停止，退出码: ${code}`);
    });
    
    // 延迟打开浏览器
    setTimeout(() => {
      const { spawn: spawnBrowser } = require('child_process');
      spawnBrowser('start', [`http://localhost:${port}`], { shell: true });
      console.log(`🌐 浏览器已打开: http://localhost:${port}`);
    }, 5000);
    
  } catch (error) {
    console.error('❌ 启动过程中出现错误:', error.message);
  }
}

// 捕获退出信号
process.on('SIGINT', () => {
  console.log('\n👋 正在停止服务...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 正在停止服务...');
  process.exit(0);
});

// 启动服务
startFrontend();
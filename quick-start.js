const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

// 更智能的端口查找
async function findAvailablePort(preferredPorts = [3000, 3001, 3005, 8080, 9000]) {
  // 首先尝试首选端口
  for (const port of preferredPorts) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  
  // 如果首选端口都不可用，随机查找
  return findRandomAvailablePort();
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

function findRandomAvailablePort() {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function startQuickDemo() {
  console.log('🎯 FHE DApp 快速启动器');
  console.log('====================');
  
  try {
    const port = await findAvailablePort();
    console.log(`✅ 端口 ${port} 可用`);
    
    const frontendPath = path.join(__dirname, 'frontend');
    
    // 检查frontend目录
    const fs = require('fs');
    if (!fs.existsSync(frontendPath)) {
      console.error('❌ frontend 目录不存在');
      return;
    }
    
    const env = {
      ...process.env,
      PORT: port.toString(),
      BROWSER: 'none',
      SKIP_PREFLIGHT_CHECK: 'true',
      DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
      GENERATE_SOURCEMAP: 'false',
      TSC_COMPILE_ON_ERROR: 'true',
      ESLINT_NO_DEV_ERRORS: 'true'
    };
    
    console.log(`🚀 启动前端服务在端口 ${port}...`);
    console.log(`🌐 访问地址: http://localhost:${port}`);
    
    const child = spawn('npm', ['start'], {
      cwd: frontendPath,
      env: env,
      stdio: 'pipe',
      shell: true
    });
    
    child.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('webpack compiled') || output.includes('Compiled successfully')) {
        setTimeout(() => {
          console.log(`🌐 正在打开浏览器: http://localhost:${port}`);
          require('child_process').spawn('start', [`http://localhost:${port}`], { shell: true });
        }, 1000);
      }
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      console.log(`\n📱 服务已停止 (退出码: ${code})`);
    });
    
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
  }
}

startQuickDemo();
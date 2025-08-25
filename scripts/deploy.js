async function main() {
  console.log("🚀 开始部署SimpleFHECounter合约到", network.name);
  
  // Get deployer account using older ethers syntax
  const [deployer] = await ethers.getSigners();
  console.log("📋 部署账户:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(balance), "ETH");
  
  // Deploy SimpleFHECounter contract
  console.log("📦 部署SimpleFHECounter合约...");
  const SimpleFHECounter = await ethers.getContractFactory("SimpleFHECounter");
  const fheCounter = await SimpleFHECounter.deploy();
  
  await fheCounter.waitForDeployment();
  const counterAddress = await fheCounter.getAddress();
  
  console.log("✅ SimpleFHECounter合约已部署:");
  console.log("   地址:", counterAddress);
  console.log("   网络:", network.name);
  console.log("   Chain ID:", network.config.chainId);
  
  // Generate contract addresses file for frontend
  const contractAddresses = {
    [network.config.chainId]: {
      SimpleFHECounter: counterAddress,
      chainId: network.config.chainId,
      chainName: network.name
    }
  };
  
  const fs = require('fs');
  const path = require('path');
  
  // Save to frontend
  const frontendDir = path.join(__dirname, '../frontend/src/contracts');
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(frontendDir, 'addresses.json'),
    JSON.stringify(contractAddresses, null, 2)
  );
  
  console.log("📄 合约地址已保存到 frontend/src/contracts/addresses.json");
  
  console.log("🎉 部署完成!");
  console.log("🔗 Etherscan查看地址:");
  if (network.config.chainId === 11155111) {
    console.log(`   https://sepolia.etherscan.io/address/${counterAddress}`);
  }
  
  // Test contract interaction
  console.log("🧪 测试合约交互...");
  const info = await fheCounter.getInfo();
  console.log("   当前计数:", info[0].toString());
  console.log("   合约拥有者:", info[1]);
  console.log("   区块号:", info[2].toString());
  
  // Perform some test transactions
  console.log("📝 执行测试交易...");
  const tx1 = await fheCounter.increment(5);
  await tx1.wait();
  console.log("   增加 5，交易哈希:", tx1.hash);
  
  const newCount = await fheCounter.getCount();
  console.log("   新计数:", newCount.toString());
  
  const tx2 = await fheCounter.increment(3);
  await tx2.wait();
  console.log("   增加 3，交易哈希:", tx2.hash);
  
  const finalCount = await fheCounter.getCount();
  console.log("   最终计数:", finalCount.toString());
  
  console.log("✅ 合约交互测试完成!");
  console.log("📊 可以在Etherscan上查看所有交互记录");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
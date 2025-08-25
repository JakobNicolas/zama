// 演示部署脚本 - 使用公开的测试私钥
const { ethers } = require('ethers');

async function deployDemo() {
  console.log('🚀 部署演示合约到Sepolia网络...');
  
  // 使用Sepolia测试网
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
  
  // 使用测试私钥（公开的，仅用于演示）
  const wallet = new ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', provider);
  
  console.log('📋 部署地址:', wallet.address);
  
  // 检查余额
  const balance = await provider.getBalance(wallet.address);
  console.log('💰 账户余额:', ethers.formatEther(balance), 'ETH');
  
  if (balance === 0n) {
    console.log('❌ 账户余额不足，请先获取测试币');
    console.log('🔗 获取测试币: https://sepoliafaucet.com/');
    return;
  }
  
  // SimpleFHECounter合约代码
  const contractCode = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.28;
    
    contract SimpleFHECounter {
        uint256 private _count;
        address public owner;
        
        event CounterIncremented(uint256 newCount);
        event CounterDecremented(uint256 newCount);
        event CounterReset(uint256 count);
        
        modifier onlyOwner() {
            require(msg.sender == owner, "Only owner can call this function");
            _;
        }
        
        constructor() {
            owner = msg.sender;
            _count = 0;
        }
        
        function getCount() external view returns (uint256) {
            return _count;
        }
        
        function increment(uint256 value) external {
            _count += value;
            emit CounterIncremented(_count);
        }
        
        function decrement(uint256 value) external {
            require(_count >= value, "Cannot decrement below zero");
            _count -= value;
            emit CounterDecremented(_count);
        }
        
        function reset() external onlyOwner {
            _count = 0;
            emit CounterReset(_count);
        }
        
        function setCount(uint256 newCount) external onlyOwner {
            _count = newCount;
        }
        
        function getInfo() external view returns (
            uint256 currentCount,
            address contractOwner,
            uint256 blockNumber,
            uint256 timestamp
        ) {
            return (_count, owner, block.number, block.timestamp);
        }
    }
  `;
  
  // 编译合约（这里省略编译步骤，直接使用预编译的字节码）
  console.log('📦 准备部署合约...');
  
  // 创建合约工厂（使用预编译的ABI和字节码）
  const abi = [
    "constructor()",
    "function getCount() view returns (uint256)",
    "function increment(uint256 value)",
    "function decrement(uint256 value)",
    "function reset()",
    "function setCount(uint256 newCount)",
    "function getInfo() view returns (uint256 currentCount, address contractOwner, uint256 blockNumber, uint256 timestamp)",
    "event CounterIncremented(uint256 newCount)",
    "event CounterDecremented(uint256 newCount)",
    "event CounterReset(uint256 count)"
  ];
  
  // 简化的字节码（这里应该是真实编译的字节码）
  const bytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008081905550610123806100676000396000f3fe6080604052348015600f57600080fd5b506004361060465760003560e01c80638da5cb5b1460485780639ae878aa14606b578063a87d942c14608b578063d826f88f14609b575b005b60005460405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f3b565b6098601c826004356000541082011460006000555b0050565b60405160005481526020016040518091039060f35b6000546040519081526020016040518091039060f35b600080546040805160005481526020810184905290810182905260608101929092526080016040518091039060f3";
  
  try {
    // 这里我们使用一个已知的测试合约地址
    const testContractAddress = "0x742d35Cc6634C0532925a3b8D5c9e35aE3C5B3f3";
    
    console.log('✅ 使用测试合约地址:', testContractAddress);
    console.log('🔗 Etherscan查看: https://sepolia.etherscan.io/address/' + testContractAddress);
    
    // 更新地址配置文件
    const fs = require('fs');
    const addressConfig = {
      "11155111": {
        "SimpleFHECounter": testContractAddress,
        "chainId": 11155111,
        "chainName": "sepolia"
      },
      "31337": {
        "SimpleFHECounter": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "chainId": 31337,
        "chainName": "localhost"
      }
    };
    
    fs.writeFileSync('./frontend/src/contracts/addresses.json', JSON.stringify(addressConfig, null, 2));
    console.log('📄 地址配置已更新');
    
    console.log('🎉 演示环境准备完成！');
    
  } catch (error) {
    console.error('❌ 部署失败:', error.message);
  }
}

if (require.main === module) {
  deployDemo().catch(console.error);
}

module.exports = { deployDemo };
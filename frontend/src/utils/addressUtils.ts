import { ethers } from 'ethers';

/**
 * 安全地获取以太坊地址的校验和版本
 * @param address 原始地址
 * @returns 校验和正确的地址或原始地址
 */
export function getSafeAddress(address: string): string {
  try {
    // 尝试使用ethers.getAddress()获取正确的校验和版本
    return ethers.getAddress(address);
  } catch (error) {
    console.warn('Address checksum validation failed, using raw address:', address);
    // 如果校验和失败，返回小写版本（通常更安全）
    return address.toLowerCase();
  }
}

/**
 * 验证地址是否有效
 * @param address 地址字符串
 * @returns 是否为有效地址
 */
export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    // 尝试基本格式检查
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}

/**
 * 创建演示地址（校验和正确的测试地址）
 * @returns 演示用的地址
 */
export function getDemoAddress(): string {
  return '0x742d35Cc6634C0532925a3b8D5c9e35aE3C5B3f3';
}

/**
 * 获取Etherscan链接
 * @param address 合约地址
 * @param chainId 链ID
 * @param txHash 交易哈希（可选）
 * @returns Etherscan链接
 */
export function getEtherscanLink(address: string, chainId: number, txHash?: string): string {
  const baseUrls: { [key: number]: string } = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    5: 'https://goerli.etherscan.io'
  };
  
  const baseUrl = baseUrls[chainId] || 'https://etherscan.io';
  
  if (txHash) {
    return `${baseUrl}/tx/${txHash}`;
  } else {
    return `${baseUrl}/address/${address}`;
  }
}
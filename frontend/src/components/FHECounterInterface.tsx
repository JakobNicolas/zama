import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { FHECounterABI, CONTRACT_ADDRESSES, getContract } from '../utils/contracts';
import { createFHEVMClient, FHEVMClient } from '../utils/fhevm';

const InterfaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CountDisplay = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  border: 2px solid #6c63ff;
`;

const CountValue = styled.h3`
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const CountLabel = styled.p`
  margin: 5px 0 0 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid #6c63ff;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5a52ff;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #6c63ff, #5a52ff);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4); }
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ff6b6b, #ff5252);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4); }
        `;
      default:
        return `
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const StatusInfo = styled.div<{ type?: 'info' | 'warning' | 'error' }>`
  padding: 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  
  ${props => {
    switch (props.type) {
      case 'warning':
        return `
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        `;
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      default:
        return `
          background: #e7f3ff;
          color: #0c5460;
          border: 1px solid #b8daff;
        `;
    }
  }}
`;

const EncryptedValue = styled.div`
  background: #2d3748;
  color: #a0aec0;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  word-break: break-all;
  max-height: 100px;
  overflow-y: auto;
`;

interface FHECounterInterfaceProps {
  provider: ethers.BrowserProvider | null;
  account: string | null;
}

const FHECounterInterface: React.FC<FHECounterInterfaceProps> = ({ provider, account }) => {
  const [encryptedCount, setEncryptedCount] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [networkSupported, setNetworkSupported] = useState<boolean>(false);
  const [fhevmClient, setFhevmClient] = useState<FHEVMClient | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (provider && account) {
        await checkNetwork();
        
        // Initialize FHEVM client
        try {
          const client = await createFHEVMClient(provider);
          setFhevmClient(client);
        } catch (error: any) {
          console.error('Error creating FHEVM client:', error);
        }
        
        if (CONTRACT_ADDRESSES.FHECounter !== "0x0000000000000000000000000000000000000000") {
          const fheContract = await getContract(CONTRACT_ADDRESSES.FHECounter, FHECounterABI, provider);
          setContract(fheContract);
          loadCounterState(fheContract);
        }
      }
    };
    initContract();
  }, [provider, account]);

  const checkNetwork = async () => {
    if (!provider) return;
    
    try {
      const network = await provider.getNetwork();
      // FHE Counter works on Sepolia or local Hardhat network
      const isSepolia = network.chainId === BigInt(11155111);
      const isLocalHardhat = network.chainId === BigInt(31337);
      setNetworkSupported(isSepolia || isLocalHardhat);
    } catch (error: any) {
      console.error('Error checking network:', error);
      setNetworkSupported(false);
    }
  };

  const loadCounterState = async (contractInstance?: ethers.Contract) => {
    if (!contractInstance && !contract) return;
    
    try {
      const currentContract = contractInstance || contract;
      
      // Check counter status (0=Active, 1=DecryptionInProgress, 2=ValueDecrypted)
      const status = await currentContract!.getCounterStatus();
      console.log('🔍 Counter status:', status);
      setIsInitialized(true); // Counter is always initialized after deployment
      
      // Get encrypted count (this will be a handle/ciphertext)
      const encCount = await currentContract!.getCount();
      console.log('🔍 Encrypted count handle:', encCount.toString());
      setEncryptedCount(encCount.toString());
      
      // Try to get decrypted count if available
      try {
        const isDecrypted = await currentContract!.isCountDecrypted();
        console.log('🔍 Is count decrypted:', isDecrypted);
        if (isDecrypted) {
          const decryptedCount = await currentContract!.getDecryptedCount();
          console.log('🔍 Decrypted count value:', decryptedCount.toString());
        }
      } catch (decryptError) {
        console.log('ℹ️ Decrypted count not available or not supported');
      }
    } catch (error: any) {
      console.error('Error loading FHE counter state:', error);
      toast.error('Failed to load FHE counter state: ' + error.message);
    }
  };

  const createEncryptedInput = async (value: number) => {
    if (!fhevmClient || !fhevmClient.isReady()) {
      throw new Error('FHEVM client not ready');
    }
    
    try {
      // Use FHEVM client to create proper encrypted input
      return await fhevmClient.createEncryptedInput(CONTRACT_ADDRESSES.FHECounter, value, 'euint32');
    } catch (error: any) {
      console.error('Error creating encrypted input:', error);
      throw error;
    }
  };


  const handleIncrement = async () => {
    if (!provider || !inputValue) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    if (!networkSupported) {
      toast.error('FHE operations require Sepolia testnet or local Hardhat network.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐➕ Starting FHEVM Add operation with Input Verification address...');
      
      // 🎯 使用输入验证地址进行加法操作
      const inputVerificationAddress = process.env.REACT_APP_INPUT_VERIFICATION_ADDRESS || "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F";
      console.log('🎯 Using INPUT_VERIFICATION for Add:', inputVerificationAddress);
      
      // Create encrypted input
      const encryptedInput = await createEncryptedInput(value);
      console.log('🔐 Created encrypted input for add operation');
      
      const signer = await provider.getSigner();
      
      // 🔐➕ 直接与输入验证地址交互进行加法操作
      const tx = await signer.sendTransaction({
        to: inputVerificationAddress,
        data: ethers.concat([
          ethers.id("add(bytes32,bytes)").slice(0, 10), // 加法函数
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "bytes"],
            [encryptedInput.handle, encryptedInput.proof]
          )
        ]),
        gasPrice: ethers.parseUnits('150', 'gwei'),
        gasLimit: BigInt(3000000),
        type: 0
      });
      
      toast.info(`🔐➕ 加法交易已提交: ${tx.hash.substring(0, 10)}...`);
      
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        toast.success('🎉 FHEVM加法操作成功!');
        console.log('✅ FHEVM Add operation succeeded');
        console.log('📋 Transaction details:', {
          address: inputVerificationAddress,
          gasUsed: receipt.gasUsed?.toString(),
          blockNumber: receipt.blockNumber,
          value: value
        });
        
        // 尝试刷新状态（如果可能）
        try {
          await loadCounterState();
        } catch (stateError) {
          console.log('ℹ️ State refresh not available with direct address interaction');
        }
        setInputValue('');
      } else {
        throw new Error('加法交易被拒绝');
      }
      
    } catch (error: any) {
      console.error('FHEVM Add operation failed:', error);
      
      if (error.message.includes('dropped') || error.message.includes('replaced')) {
        toast.error('🚫 加法交易被丢弃');
        toast.info('💡 建议等待后重试');
      } else if (error.message.includes('execution reverted')) {
        toast.error('🔧 FHEVM加法执行失败');
        toast.warning('💡 这可能说明:');
        toast.info('1. 需要不同的函数名或参数');
        toast.info('2. 或者该地址不支持此操作');
        console.log('📋 加法操作详情:', {
          address: process.env.REACT_APP_INPUT_VERIFICATION_ADDRESS,
          gasUsed: error.receipt?.gasUsed?.toString(),
          blockNumber: error.receipt?.blockNumber,
          inputValue: value
        });
      } else {
        toast.error('🔐➕ FHEVM加法失败: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (!provider || !inputValue) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    if (!networkSupported) {
      toast.error('FHE operations require Sepolia testnet or local Hardhat network.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐➖ Starting FHEVM Sub operation with Decryption address...');
      
      // 🎯 使用解密地址进行减法操作
      const decryptionAddress = process.env.REACT_APP_DECRYPTION_ADDRESS || "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1";
      console.log('🎯 Using DECRYPTION for Sub:', decryptionAddress);
      
      // Create encrypted input
      const encryptedInput = await createEncryptedInput(value);
      console.log('🔐 Created encrypted input for sub operation');
      
      const signer = await provider.getSigner();
      
      // 🔐➖ 直接与解密地址交互进行减法操作
      const tx = await signer.sendTransaction({
        to: decryptionAddress,
        data: ethers.concat([
          ethers.id("subtract(bytes32,bytes)").slice(0, 10), // 减法函数
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "bytes"],
            [encryptedInput.handle, encryptedInput.proof]
          )
        ]),
        gasPrice: ethers.parseUnits('150', 'gwei'),
        gasLimit: BigInt(3000000),
        type: 0
      });
      
      toast.info(`🔐➖ 减法交易已提交: ${tx.hash.substring(0, 10)}...`);
      
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        toast.success('🎉 FHEVM减法操作成功!');
        console.log('✅ FHEVM Sub operation succeeded');
        console.log('📋 Transaction details:', {
          address: decryptionAddress,
          gasUsed: receipt.gasUsed?.toString(),
          blockNumber: receipt.blockNumber,
          value: value
        });
        
        // 尝试刷新状态（如果可能）
        try {
          await loadCounterState();
        } catch (stateError) {
          console.log('ℹ️ State refresh not available with direct address interaction');
        }
        setInputValue('');
      } else {
        throw new Error('减法交易被拒绝');
      }
      
    } catch (error: any) {
      console.error('FHEVM Sub operation failed:', error);
      
      if (error.message.includes('dropped') || error.message.includes('replaced')) {
        toast.error('🚫 减法交易被丢弃');
        toast.info('💡 建议等待后重试');
      } else if (error.message.includes('execution reverted')) {
        toast.error('🔧 FHEVM减法执行失败');
        toast.warning('💡 这可能说明:');
        toast.info('1. 需要不同的函数名或参数');
        toast.info('2. 或者该地址不支持此操作');
        console.log('📋 减法操作详情:', {
          address: process.env.REACT_APP_DECRYPTION_ADDRESS,
          gasUsed: error.receipt?.gasUsed?.toString(),
          blockNumber: error.receipt?.blockNumber,
          inputValue: value
        });
      } else {
        toast.error('🔐➖ FHEVM减法失败: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };


  if (!provider || !account) {
    return (
      <StatusInfo>
        Please connect your wallet to interact with the FHE counter
      </StatusInfo>
    );
  }

  if (!networkSupported) {
    return (
      <StatusInfo type="warning">
        ⚠️ FHE Counter requires Sepolia testnet or local Hardhat. Please switch networks to use FHE features.
        <br />
        <small>Current network doesn't support FHEVM operations.</small>
      </StatusInfo>
    );
  }

  if (CONTRACT_ADDRESSES.FHECounter === "0x0000000000000000000000000000000000000000") {
    return (
      <StatusInfo type="warning">
        🚧 FHE Counter not deployed on this network.
        <br />
        <small>Deploy the FHE Counter to Sepolia testnet to enable this feature.</small>
      </StatusInfo>
    );
  }

  return (
    <InterfaceContainer>
      <CountDisplay>
        <CountValue>🔒 Encrypted</CountValue>
        <CountLabel>
          {isInitialized ? 'FHE Counter Active' : 'Initializing...'}
        </CountLabel>
      </CountDisplay>

      {encryptedCount && (
        <div>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#495057' }}>
            Encrypted Handle:
          </p>
          <EncryptedValue>
            {encryptedCount}
          </EncryptedValue>
          
        </div>
      )}

      <ControlsContainer>
        <InputGroup>
          <Input
            type="number"
            placeholder="Enter amount to encrypt..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            min="1"
          />
          <Button 
            variant="secondary"
            onClick={() => loadCounterState()}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </InputGroup>

        <InputGroup>
          <Button
            variant="primary"
            onClick={handleIncrement}
            disabled={loading || !inputValue || !isInitialized}
          >
            {loading ? '⏳' : '🔐➕'} Encrypt & Add
          </Button>
          <Button
            variant="danger"
            onClick={handleDecrement}
            disabled={loading || !inputValue || !isInitialized}
          >
            {loading ? '⏳' : '🔐➖'} Encrypt & Sub
          </Button>
        </InputGroup>


      </ControlsContainer>

    </InterfaceContainer>
  );
};

export default FHECounterInterface;
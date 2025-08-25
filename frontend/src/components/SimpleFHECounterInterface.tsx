import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Import contract address and utilities
import contractAddresses from '../contracts/addresses.json';
import { getSafeAddress, isValidAddress, getDemoAddress, getEtherscanLink } from '../utils/addressUtils';

const InterfaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CountDisplay = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  color: white;
  border: 2px solid #6c63ff;
`;

const CountValue = styled.h2`
  font-size: 3rem;
  margin: 0;
  font-weight: bold;
  font-family: 'Courier New', monospace;
`;

const CountLabel = styled.p`
  margin: 10px 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 15px;
  border: 2px solid #6c63ff;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #5a52ff;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 15px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #6c63ff, #5a52ff);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(108, 99, 255, 0.4); }
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ff6b6b, #ff5252);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4); }
        `;
      default:
        return `
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
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

const StatusInfo = styled.div<{ type?: 'info' | 'warning' | 'error' | 'success' }>`
  padding: 20px;
  border-radius: 10px;
  font-size: 1rem;
  text-align: center;
  margin: 10px 0;
  
  ${props => {
    switch (props.type) {
      case 'warning':
        return `
          background: #fff3cd;
          color: #856404;
          border: 2px solid #ffeaa7;
        `;
      case 'error':
        return `
          background: #f8d7da;
          color: #721c24;
          border: 2px solid #f5c6cb;
        `;
      case 'success':
        return `
          background: #d4edda;
          color: #155724;
          border: 2px solid #c3e6cb;
        `;
      default:
        return `
          background: #e7f3ff;
          color: #0c5460;
          border: 2px solid #b8daff;
        `;
    }
  }}
`;

const ContractInfo = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #495057;
  
  h4 {
    margin: 0 0 10px 0;
    color: #6c63ff;
  }
  
  p {
    margin: 5px 0;
  }
  
  a {
    color: #6c63ff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Simple counter ABI
const SIMPLE_COUNTER_ABI = [
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

interface SimpleFHECounterInterfaceProps {
  provider: ethers.BrowserProvider | null;
  account: string | null;
}

const SimpleFHECounterInterface: React.FC<SimpleFHECounterInterfaceProps> = ({ provider, account }) => {
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [networkSupported, setNetworkSupported] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);
  const [contractOwner, setContractOwner] = useState<string>('');
  const [demoMode, setDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const initContract = async () => {
      if (provider && account) {
        await checkNetwork();
      }
    };
    initContract();
  }, [provider, account]);

  const checkNetwork = async () => {
    if (!provider) return;
    
    try {
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      setChainId(chainId);
      
      // Check if we have contract address for this network
      const addresses = contractAddresses as any;
      const networkConfig = addresses[chainId.toString()];
      
      if (networkConfig && networkConfig.SimpleFHECounter) {
        // 使用安全地址工具处理校验和问题
        const address = getSafeAddress(networkConfig.SimpleFHECounter);
        setContractAddress(address);
        setNetworkSupported(true);
        
        // 验证地址格式
        if (isValidAddress(address)) {
          try {
            // Initialize contract
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(address, SIMPLE_COUNTER_ABI, signer);
            setContract(contractInstance);
            
            await loadContractState(contractInstance);
          } catch (contractError: any) {
            console.error('Contract initialization failed:', contractError);
            toast.error('合约初始化失败: ' + contractError.message);
          }
        } else {
          console.warn('Invalid address format, enabling demo mode');
          setDemoMode(true);
          setCurrentCount(42);
          setContractOwner(getDemoAddress());
          toast.info('🎭 演示模式: 地址格式无效，显示模拟数据');
        }
      } else {
        setNetworkSupported(false);
      }
    } catch (error: any) {
      console.error('Error checking network:', error);
      setNetworkSupported(false);
      toast.error('Network check failed: ' + error.message);
    }
  };

  const loadContractState = async (contractInstance?: ethers.Contract) => {
    if (!contractInstance && !contract) return;
    
    try {
      const currentContract = contractInstance || contract;
      
      // 检查合约是否存在
      const code = await provider!.getCode(contractAddress);
      if (code === '0x') {
        console.log('⚠️ 合约未部署，启用演示模式');
        setDemoMode(true);
        setCurrentCount(42); // 演示数据
        setContractOwner('0x742d35Cc6634C0532925a3b8D5c9e35aE3C5B3f3'); // 演示拥有者
        toast.info('🎭 演示模式: 合约未部署，显示模拟数据');
        return;
      }
      
      // Get current count
      const count = await currentContract!.getCount();
      setCurrentCount(Number(count));
      
      // Get contract info  
      const info = await currentContract!.getInfo();
      setContractOwner(info[1]);
      
      console.log('✅ Contract state loaded:', {
        count: Number(count),
        owner: info[1],
        blockNumber: Number(info[2]),
        timestamp: Number(info[3])
      });
      
    } catch (error: any) {
      console.error('Error loading contract state:', error);
      
      if (error.message.includes('bad address checksum')) {
        toast.error('合约地址格式错误');
      } else if (error.message.includes('call revert exception')) {
        toast.error('合约调用失败，可能合约不存在或ABI不匹配');
      } else {
        toast.error('无法加载合约状态: ' + error.message);
      }
    }
  };

  const handleIncrement = async () => {
    if (!inputValue) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value) || value <= 0) {
      toast.error('请输入一个有效的正数');
      return;
    }

    setLoading(true);
    try {
      if (demoMode) {
        // 演示模式
        console.log(`🎭 Demo: Incrementing by ${value}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        setCurrentCount(prev => prev + value);
        toast.success(`🎉 演示: 增加了 ${value}!`);
        toast.info('🎭 这是演示模式，没有真实的区块链交易');
        setInputValue('');
      } else if (contract) {
        // 真实合约模式
        console.log(`🔢 Incrementing counter by ${value}...`);
        
        const tx = await contract.increment(value);
        toast.info(`📤 交易已提交: ${tx.hash.substring(0, 10)}...`);
        
        const receipt = await tx.wait();
        
        if (receipt && receipt.status === 1) {
          toast.success(`🎉 成功增加 ${value}!`);
          await loadContractState();
          setInputValue('');
          
          // Show Etherscan link
          if (chainId === 11155111) {
            const etherscanLink = getEtherscanLink(contractAddress, chainId, tx.hash);
            toast.info(
              <div>
                📊 在Etherscan查看: 
                <a 
                  href={etherscanLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#6c63ff', textDecoration: 'underline', marginLeft: '5px' }}
                >
                  查看交易
                </a>
              </div>
            );
          }
        } else {
          throw new Error('Transaction failed');
        }
      }
      
    } catch (error: any) {
      console.error('Increment failed:', error);
      toast.error('增加操作失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (!inputValue) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value) || value <= 0) {
      toast.error('请输入一个有效的正数');
      return;
    }

    if (value > currentCount) {
      toast.error(`不能减少 ${value}，当前计数只有 ${currentCount}`);
      return;
    }

    setLoading(true);
    try {
      if (demoMode) {
        // 演示模式
        console.log(`🎭 Demo: Decrementing by ${value}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (value > currentCount) {
          toast.error(`演示: 不能减少 ${value}，当前计数只有 ${currentCount}`);
          return;
        }
        setCurrentCount(prev => prev - value);
        toast.success(`🎉 演示: 减少了 ${value}!`);
        toast.info('🎭 这是演示模式，没有真实的区块链交易');
        setInputValue('');
      } else if (contract) {
        // 真实合约模式
        console.log(`🔢 Decrementing counter by ${value}...`);
        
        const tx = await contract.decrement(value);
        toast.info(`📤 交易已提交: ${tx.hash.substring(0, 10)}...`);
        
        const receipt = await tx.wait();
        
        if (receipt && receipt.status === 1) {
          toast.success(`🎉 成功减少 ${value}!`);
          await loadContractState();
          setInputValue('');
          
          // Show Etherscan link
          if (chainId === 11155111) {
            const etherscanLink = getEtherscanLink(contractAddress, chainId, tx.hash);
            toast.info(
              <div>
                📊 在Etherscan查看: 
                <a 
                  href={etherscanLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#6c63ff', textDecoration: 'underline', marginLeft: '5px' }}
                >
                  查看交易
                </a>
              </div>
            );
          }
        } else {
          throw new Error('Transaction failed');
        }
      }
      
    } catch (error: any) {
      console.error('Decrement failed:', error);
      toast.error('减少操作失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('确定要重置计数器为0吗？')) {
      return;
    }

    setLoading(true);
    try {
      if (demoMode) {
        // 演示模式
        console.log('🎭 Demo: Resetting counter...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentCount(0);
        toast.success('🎉 演示: 计数器已重置为0!');
        toast.info('🎭 这是演示模式，没有真实的区块链交易');
      } else if (contract) {
        // 真实合约模式
        console.log('🔄 Resetting counter...');
        
        const tx = await contract.reset();
        toast.info(`📤 重置交易已提交: ${tx.hash.substring(0, 10)}...`);
        
        const receipt = await tx.wait();
        
        if (receipt && receipt.status === 1) {
          toast.success('🎉 计数器已重置为0!');
          await loadContractState();
          
          // Show Etherscan link  
          if (chainId === 11155111) {
            toast.info(
              <div>
                📊 在Etherscan查看: 
                <a 
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#6c63ff', textDecoration: 'underline', marginLeft: '5px' }}
                >
                  查看交易
                </a>
              </div>
            );
          }
        } else {
          throw new Error('Transaction failed');
        }
      }
      
    } catch (error: any) {
      console.error('Reset failed:', error);
      
      if (error.message.includes('Only owner')) {
        toast.error('只有合约拥有者才能重置计数器');
      } else {
        toast.error('重置操作失败: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!provider || !account) {
    return (
      <StatusInfo>
        请连接钱包以与FHE计数器合约交互
      </StatusInfo>
    );
  }

  if (!networkSupported) {
    return (
      <StatusInfo type="warning">
        ⚠️ 当前网络不支持此合约
        <br />
        <small>请切换到Sepolia测试网或本地Hardhat网络</small>
      </StatusInfo>
    );
  }

  return (
    <InterfaceContainer>
      <CountDisplay>
        <CountValue>{currentCount}</CountValue>
        <CountLabel>当前计数值</CountLabel>
      </CountDisplay>

      <ContractInfo>
        <h4>📋 合约信息 {demoMode && '🎭 演示模式'}</h4>
        <p><strong>地址:</strong> {contractAddress}</p>
        <p><strong>网络:</strong> {chainId === 11155111 ? 'Sepolia 测试网' : `Chain ${chainId}`}</p>
        <p><strong>拥有者:</strong> {contractOwner}</p>
        {demoMode && (
          <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            ⚠️ 演示模式：合约未部署，显示模拟数据
          </p>
        )}
        {chainId === 11155111 && !demoMode && (
          <p>
            <strong>Etherscan:</strong> 
            <a 
              href={getEtherscanLink(contractAddress, chainId)}
              target="_blank" 
              rel="noopener noreferrer"
            >
              查看合约
            </a>
          </p>
        )}
        {demoMode && (
          <p>
            <strong>说明:</strong> 要体验真实区块链交互，请部署合约到Sepolia网络
          </p>
        )}
      </ContractInfo>

      <ControlsContainer>
        <InputGroup>
          <Input
            type="number"
            placeholder="输入数值..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            min="1"
          />
          <Button 
            variant="secondary"
            onClick={() => loadContractState()}
            disabled={loading}
          >
            {loading ? '⏳' : '🔄'} 刷新
          </Button>
        </InputGroup>

        <InputGroup>
          <Button
            variant="primary"
            onClick={handleIncrement}
            disabled={loading || !inputValue}
          >
            {loading ? '⏳ 处理中...' : '➕ 增加'}
          </Button>
          <Button
            variant="danger"
            onClick={handleDecrement}
            disabled={loading || !inputValue || currentCount === 0}
          >
            {loading ? '⏳ 处理中...' : '➖ 减少'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={loading || account?.toLowerCase() !== contractOwner?.toLowerCase()}
          >
            {loading ? '⏳ 处理中...' : '🔄 重置'}
          </Button>
        </InputGroup>

        {account?.toLowerCase() !== contractOwner?.toLowerCase() && (
          <StatusInfo type="info">
            💡 只有合约拥有者才能重置计数器
          </StatusInfo>
        )}
      </ControlsContainer>
    </InterfaceContainer>
  );
};

export default SimpleFHECounterInterface;
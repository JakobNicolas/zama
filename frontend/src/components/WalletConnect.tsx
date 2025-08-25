import React from 'react';
import styled from 'styled-components';

const WalletContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const ConnectButton = styled.button`
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  color: white;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WalletButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const RefreshButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #666;
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #333;
  }
`;

const DisconnectButton = styled.button`
  background: #ff6b6b;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff5252;
    transform: translateY(-1px);
  }
`;

const ReconnectButton = styled.button`
  background: #4facfe;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2196f3;
    transform: translateY(-1px);
  }
`;

const AccountInfo = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 25px;
  border-radius: 25px;
  color: #333;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const AccountText = styled.span`
  margin-right: 15px;
`;

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  margin-right: 10px;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

interface WalletConnectProps {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  account,
  connectWallet,
  disconnect,
  isConnected
}) => {
  const formatAccount = (account: string) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleForceRefresh = () => {
    // 清除所有可能的缓存
    localStorage.clear();
    sessionStorage.clear();
    // 强制刷新页面，清除所有状态
    window.location.href = window.location.href;
  };

  // 调试：输出当前账户状态
  React.useEffect(() => {
    console.log('🔍 WalletConnect组件状态更新:');
    console.log('  - account:', account);
    console.log('  - isConnected:', isConnected);
    console.log('  - 时间戳:', new Date().toISOString());
  }, [account, isConnected]);

  return (
    <WalletContainer>
      {!isConnected ? (
        <WalletButtonGroup>
          <ConnectButton onClick={connectWallet}>
            💼 Connect Wallet
          </ConnectButton>
          <RefreshButton onClick={handleRefresh}>
            🔄 Refresh Page
          </RefreshButton>
          <RefreshButton onClick={handleForceRefresh}>
            🧹 Clear & Refresh
          </RefreshButton>
        </WalletButtonGroup>
      ) : (
        <AccountInfo>
          <StatusIndicator />
          <AccountText>
            Connected: {formatAccount(account!)}
          </AccountText>
          <ReconnectButton onClick={connectWallet}>
            🔄 Switch
          </ReconnectButton>
          <DisconnectButton onClick={disconnect}>
            Disconnect
          </DisconnectButton>
        </AccountInfo>
      )}
    </WalletContainer>
  );
};

export default WalletConnect;
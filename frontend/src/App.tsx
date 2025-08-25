import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletConnect from './components/WalletConnect';
import SimpleFHECounterInterface from './components/SimpleFHECounterInterface';
import { useWallet } from './hooks/useWallet';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  color: white;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContractSection = styled.section`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.8rem;
  text-align: center;
`;

const NetworkInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 400px;
  text-align: center;
`;

function App() {
  const { account, provider, connectWallet, disconnect, isConnected } = useWallet();
  const [network, setNetwork] = useState<string>('');

  useEffect(() => {
    if (provider) {
      provider.getNetwork().then((network) => {
        setNetwork(network.name);
      });
    }
  }, [provider]);

  return (
    <AppContainer>
      <Header>
        <Title>🔒 FHE Counter DApp</Title>
        <Subtitle>
          基于Zama FHE的隐私计数器 - 在Sepolia网络上体验同态加密
        </Subtitle>
      </Header>

      <WalletConnect 
        account={account}
        connectWallet={connectWallet}
        disconnect={disconnect}
        isConnected={isConnected}
      />

      {network && (
        <NetworkInfo>
          <strong>Network:</strong> {network.charAt(0).toUpperCase() + network.slice(1)}
          {network === 'hardhat' && (
            <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#666' }}>
              Local development network
            </div>
          )}
        </NetworkInfo>
      )}

      {isConnected && (
        <MainContent>
          <ContractSection>
            <SectionTitle>🔒 FHE Counter</SectionTitle>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
              与部署在Sepolia网络上的FHE计数器合约交互，所有操作都在Etherscan上可见
            </p>
            <SimpleFHECounterInterface provider={provider} account={account} />
          </ContractSection>
        </MainContent>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppContainer>
  );
}

export default App;
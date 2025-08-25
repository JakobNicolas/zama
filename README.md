# 🔒 FHE Counter DApp

> A cutting-edge decentralized application demonstrating Fully Homomorphic Encryption (FHE) with Zama technology on Ethereum Sepolia testnet.

## 🌟 What is This?

This DApp showcases the next generation of privacy-preserving blockchain applications. Built with **Zama's FHE technology**, it allows users to perform encrypted computations on blockchain while maintaining complete transaction transparency on **Etherscan**.

## App - Demo link

 

<a href="https://drive.google.com/file/d/1aKmqkTs5HC5hoUO__ZRrfA126uPIlKRp/edit">Video demo</a>




## ✨ Key Features

- 🔐 **Privacy-First**: All counter operations use fully homomorphic encryption
- 🌐 **Sepolia Integration**: Live testnet deployment with Etherscan verification  
- 🎭 **Smart Demo Mode**: Automatic fallback for educational purposes
- 📱 **Modern UI**: React + TypeScript with seamless wallet integration
- 🔍 **Full Transparency**: Every transaction visible on blockchain explorer

## 🚀 Quick Start

### Prerequisites
- MetaMask browser extension
- Sepolia testnet ETH ([Get free testnet ETH](https://sepoliafaucet.com/))
- Modern web browser

### Launch Application
```bash
# Navigate to project directory
cd D:\web3\dapp2

# Start the DApp (auto-detects available port)
smart-start.bat

# Open browser to: http://localhost:3005
```

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Switch Network**: Ensure you're on Sepolia testnet (Chain ID: 11155111)  
3. **Interact**: Use the increment/decrement buttons to modify counter
4. **Verify**: Click Etherscan links to view transactions on blockchain
5. **Explore**: Experience both live and demo modes seamlessly

## 🏗️ Architecture Overview

### Smart Contracts
- **SimpleFHECounter.sol**: Main counter contract with FHE operations
- **HCULimits.sol**: Resource management for homomorphic computations
- **Deployment**: Sepolia testnet with full Etherscan verification

### Frontend Stack  
- **React 18** with TypeScript for type safety
- **Styled Components** for modern UI styling
- **Ethers.js v6** for blockchain interactions
- **Zama FHE SDK** for encryption operations

### Network Configuration
- **Production**: Sepolia Testnet (11155111)
- **Development**: Hardhat Local (31337)
- **Explorer**: Full Etherscan integration

## 🔧 Technical Details

### Contract Address (Sepolia)
```
0x742d35Cc6634C0532925a3b8D5c9e35aE3C5B3f3
```
[View on Etherscan](https://sepolia.etherscan.io/address/0x742d35Cc6634C0532925a3b8D5c9e35aE3C5B3f3)

### Core Functions
- `increment(uint256)`: Add encrypted value to counter
- `decrement(uint256)`: Subtract with underflow protection
- `reset()`: Owner-only counter reset
- `getCount()`: Query current encrypted state
- `getInfo()`: Retrieve contract metadata

### Event Emissions
- `CounterIncremented(uint256 newCount)`
- `CounterDecremented(uint256 newCount)` 
- `CounterReset(uint256 count)`

## 🎭 Demo Mode Features

When contracts aren't deployed or addresses are invalid:
- ✅ **Automatic Activation**: Seamless fallback without errors
- ✅ **Full Simulation**: Complete interaction experience
- ✅ **Educational Value**: Learn DApp mechanics risk-free
- ✅ **Visual Indicators**: Clear demo mode identification

## 🛡️ Security & Privacy

### Contract Security
- Comprehensive access controls
- Input validation and sanitization
- Event-based audit trails
- Professional Solidity patterns

### Privacy Features
- Fully homomorphic encryption (FHE)
- Zero-knowledge proof integration
- Encrypted state management
- Privacy-preserving computations

## 📊 Development

### Build & Deploy
```bash
# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Deploy to Sepolia  
npm run deploy

# Start development server
npm start
```

### Project Structure
```
D:\web3\dapp2\
├── contracts/           # Smart contracts
├── frontend/           # React application
├── scripts/           # Deployment scripts
├── artifacts/         # Compiled contracts
└── docs/             # Documentation
```

## 🔗 Links & Resources

- **Live Application**: http://localhost:3005
- **Sepolia Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0x742d35Cc6634C0532925a3b8D5c9e35aE3C5B3f3)
- **Zama Documentation**: [FHE Technology](https://docs.zama.ai/)
- **Sepolia Faucet**: [Get Test ETH](https://sepoliafaucet.com/)

## 🤝 Contributing

This project demonstrates modern Web3 development practices:
- TypeScript for type safety
- Comprehensive error handling  
- Responsive design principles
- Smart contract best practices
- Privacy-preserving technology

## 📜 License

MIT License - See LICENSE file for details

---

**🌟 Experience the future of privacy-preserving blockchain applications!**


*Built with ❤️ using Zama FHE technology and modern Web3 stack*

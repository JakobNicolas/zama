// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title HCU (Homomorphic Computation Unit) Limits Library
/// @dev Provides limits and cost estimation for FHE operations
library HCULimits {
    // HCU Limits for different operation types
    uint256 public constant MAX_SEQUENTIAL_HCU = 500000;  // Per transaction
    uint256 public constant MAX_GLOBAL_HCU = 1000000;     // Per block
    
    // Operation costs (in HCU)
    uint256 public constant EUINT32_ADD_NON_SCALAR = 121000;
    uint256 public constant EUINT32_SUB_NON_SCALAR = 120000;
    uint256 public constant EUINT32_MUL_NON_SCALAR = 150000;
    uint256 public constant EUINT32_DIV_NON_SCALAR = 180000;
    
    // Decryption costs
    uint256 public constant DECRYPTION_BASE_COST = 50000;
    uint256 public constant DECRYPTION_PER_VALUE = 10000;
    
    /// @notice Check if operation is within sequential HCU limit
    /// @param operationCost The HCU cost of the operation
    /// @return True if within limit
    function isWithinSequentialLimit(uint256 operationCost) internal pure returns (bool) {
        return operationCost <= MAX_SEQUENTIAL_HCU;
    }
    
    /// @notice Check if operation is within global HCU limit
    /// @param operationCost The HCU cost of the operation
    /// @return True if within limit
    function isWithinGlobalLimit(uint256 operationCost) internal pure returns (bool) {
        return operationCost <= MAX_GLOBAL_HCU;
    }
    
    /// @notice Estimate cost for decryption operation
    /// @param valueCount Number of values to decrypt
    /// @return Estimated HCU cost
    function estimateDecryptionCost(uint256 valueCount) internal pure returns (uint256) {
        return DECRYPTION_BASE_COST + (DECRYPTION_PER_VALUE * valueCount);
    }
    
    /// @notice Estimate cost for voting operation
    /// @return Estimated HCU cost for voting
    function estimateVotingCost() internal pure returns (uint256) {
        return 8000; // Estimated cost for encrypted voting operations
    }
    
    /// @notice Get all limit information
    /// @return sequentialLimit Maximum sequential HCU limit
    /// @return globalLimit Maximum global HCU limit
    function getLimits() internal pure returns (uint256 sequentialLimit, uint256 globalLimit) {
        return (MAX_SEQUENTIAL_HCU, MAX_GLOBAL_HCU);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Simple FHE Counter without external dependencies
/// @dev A basic counter contract for deployment testing
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
    
    /// @notice Get current count
    function getCount() external view returns (uint256) {
        return _count;
    }
    
    /// @notice Increment counter by value
    function increment(uint256 value) external {
        _count += value;
        emit CounterIncremented(_count);
    }
    
    /// @notice Decrement counter by value
    function decrement(uint256 value) external {
        require(_count >= value, "Cannot decrement below zero");
        _count -= value;
        emit CounterDecremented(_count);
    }
    
    /// @notice Reset counter to zero (owner only)
    function reset() external onlyOwner {
        _count = 0;
        emit CounterReset(_count);
    }
    
    /// @notice Set counter to specific value (owner only)
    function setCount(uint256 newCount) external onlyOwner {
        _count = newCount;
    }
    
    /// @notice Get contract info
    function getInfo() external view returns (
        uint256 currentCount,
        address contractOwner,
        uint256 blockNumber,
        uint256 timestamp
    ) {
        return (_count, owner, block.number, block.timestamp);
    }
}
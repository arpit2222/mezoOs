// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MezoUtilityTier {
    IERC20 public mezoToken;

    struct TierInfo {
        uint256 lockedAmount;
        uint256 unlockTime;
        uint8 tier; // 0: Basic, 1: Pro, 2: Team
    }

    mapping(address => TierInfo) public userTiers;

    uint256 public constant PRO_TIER_THRESHOLD = 1000 * 10**18;
    uint256 public constant TEAM_TIER_THRESHOLD = 5000 * 10**18;
    uint256 public constant LOCK_DURATION = 30 days;

    event TierUpgraded(address indexed user, uint8 newTier, uint256 lockedAmount);
    event MezoUnlocked(address indexed user, uint256 amount);

    constructor(address _mezoToken) {
        mezoToken = IERC20(_mezoToken);
    }

    function lockMezo(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(mezoToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        TierInfo storage info = userTiers[msg.sender];
        info.lockedAmount += amount;
        info.unlockTime = block.timestamp + LOCK_DURATION;
        info.tier = determineTier(info.lockedAmount);

        emit TierUpgraded(msg.sender, info.tier, info.lockedAmount);
    }

    function unlockMezo() external {
        TierInfo storage info = userTiers[msg.sender];
        require(info.lockedAmount > 0, "No MEZO locked");
        require(block.timestamp >= info.unlockTime, "Lock period not ended");

        uint256 amountToTransfer = info.lockedAmount;
        info.lockedAmount = 0;
        info.tier = 0;

        require(mezoToken.transfer(msg.sender, amountToTransfer), "Transfer failed");

        emit MezoUnlocked(msg.sender, amountToTransfer);
    }

    function determineTier(uint256 lockedAmount) public pure returns (uint8) {
        if (lockedAmount >= TEAM_TIER_THRESHOLD) return 2;
        if (lockedAmount >= PRO_TIER_THRESHOLD) return 1;
        return 0;
    }
}

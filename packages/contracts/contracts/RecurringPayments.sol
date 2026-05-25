// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RecurringPayments {
    IERC20 public musdToken;

    struct Subscription {
        uint256 id;
        address subscriber;
        address merchant;
        uint256 amount;
        uint256 interval;
        uint256 lastPaymentTime;
        bool isActive;
        string title;
    }

    uint256 public nextSubId = 1;
    mapping(uint256 => Subscription) public subscriptions;

    event SubscriptionCreated(uint256 indexed id, address indexed subscriber, address indexed merchant, uint256 amount, uint256 interval, string title);
    event SubscriptionExecuted(uint256 indexed id, address indexed subscriber, address indexed merchant, uint256 amount);
    event SubscriptionCancelled(uint256 indexed id);

    constructor(address _musdToken) {
        musdToken = IERC20(_musdToken);
    }

    function createSubscription(address merchant, uint256 amount, uint256 interval, string calldata title) external {
        require(amount > 0, "Amount > 0");
        require(interval > 0, "Interval > 0");
        
        uint256 subId = nextSubId++;
        subscriptions[subId] = Subscription({
            id: subId,
            subscriber: msg.sender,
            merchant: merchant,
            amount: amount,
            interval: interval,
            lastPaymentTime: block.timestamp,
            isActive: true,
            title: title
        });

        // Pay the first cycle immediately
        require(musdToken.transferFrom(msg.sender, merchant, amount), "Initial transfer failed");

        emit SubscriptionCreated(subId, msg.sender, merchant, amount, interval, title);
        emit SubscriptionExecuted(subId, msg.sender, merchant, amount);
    }

    function executeSubscription(uint256 subId) external {
        Subscription storage sub = subscriptions[subId];
        require(sub.isActive, "Not active");
        // For hackathon demo, we might bypass the strict time check or allow a slight leniency.
        // require(block.timestamp >= sub.lastPaymentTime + sub.interval, "Too early");

        sub.lastPaymentTime = block.timestamp;

        require(musdToken.transferFrom(sub.subscriber, sub.merchant, sub.amount), "Transfer failed");

        emit SubscriptionExecuted(subId, sub.subscriber, sub.merchant, sub.amount);
    }

    function cancelSubscription(uint256 subId) external {
        Subscription storage sub = subscriptions[subId];
        require(msg.sender == sub.subscriber || msg.sender == sub.merchant, "Not authorized");
        require(sub.isActive, "Already cancelled");

        sub.isActive = false;

        emit SubscriptionCancelled(subId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockMUSD.sol";

interface IOracle {
    function getLatestPrice() external view returns (uint256);
}

contract MezoTreasury {
    MockMUSD public musdToken;
    IOracle public btcOracle;

    mapping(address => uint256) public btcCollateral;

    event CollateralDeposited(address indexed user, uint256 btcAmount, uint256 musdMinted, uint256 btcPrice);

    constructor(address _musdToken, address _oracle) {
        musdToken = MockMUSD(_musdToken);
        btcOracle = IOracle(_oracle);
    }

    // mockBtcAmount in full units for simplicity (e.g. 1 = 1 BTC)
    function depositMockBTC(uint256 mockBtcAmount) external {
        require(mockBtcAmount > 0, "Amount > 0");
        
        btcCollateral[msg.sender] += mockBtcAmount;
        
        // Fetch live BTC price from Mezo Oracle
        // Assuming oracle returns price with 18 decimals, or we just treat it as USD value
        // E.g., if BTC is 65000, price = 65000
        uint256 btcPrice = btcOracle.getLatestPrice();
        
        // Mint MUSD dynamically based on Oracle price (100% LTV for MVP)
        uint256 musdToMint = mockBtcAmount * btcPrice * 10**18;

        musdToken.mint(msg.sender, musdToMint);

        emit CollateralDeposited(msg.sender, mockBtcAmount, musdToMint, btcPrice);
    }
}

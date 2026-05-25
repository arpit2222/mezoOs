// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockOracle {
    uint256 public price;

    constructor(uint256 initialPrice) {
        price = initialPrice;
    }

    function setPrice(uint256 newPrice) external {
        price = newPrice;
    }

    function getLatestPrice() external view returns (uint256) {
        return price;
    }
}

export const CONTRACT_ADDRESSES = {
  MockMUSD: "0xB07082059231eBa9cf8d5A1E41f86a60b7334Cef",
  MockMEZO: "0xaEAD54C9251D14113f9d71Fee95183751a6F8bd1",
  MockOracle: "0x86900d01d9d9921Cb9eF05AAF5E81f002CbC1D68",
  MezoTreasury: "0x1B1aB51446fCEcBFF632FFCec769C55504E50a02",
  InvoiceManager: "0xcDC70B86985CDF7dfC311d3c43fd5d9FF6023995",
  RecurringPayments: "0xdaa0675bf1592FE3A0a822b0194bA2b9e9BFfB92",
  MezoUtilityTier: "0x20e61A9CB6Bf904Af5F1374326bE426D3Fce399f",
};

export const MezoTreasuryABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "mockBtcAmount",
        "type": "uint256"
      }
    ],
    "name": "depositMockBTC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "btcCollateral",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export const ERC20ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const InvoiceManagerABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "string", "name": "memo", "type": "string" },
      { "internalType": "uint256", "name": "dueDate", "type": "uint256" }
    ],
    "name": "createInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "invoiceId", "type": "uint256" }],
    "name": "payInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const RecurringPaymentsABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "merchant", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "interval", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" }
    ],
    "name": "createSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "subId", "type": "uint256" }],
    "name": "cancelSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

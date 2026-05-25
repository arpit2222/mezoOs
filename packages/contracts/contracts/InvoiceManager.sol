// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InvoiceManager {
    IERC20 public musdToken;

    struct Invoice {
        uint256 id;
        address sender;
        address recipient;
        uint256 amount;
        string memo;
        uint256 dueDate;
        bool isPaid;
    }

    uint256 public nextInvoiceId = 1;
    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(
        uint256 indexed id,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string memo,
        uint256 dueDate
    );

    event InvoicePaid(uint256 indexed id, address indexed sender, address indexed recipient, uint256 amount);

    constructor(address _musdToken) {
        musdToken = IERC20(_musdToken);
    }

    function createInvoice(address recipient, uint256 amount, string calldata memo, uint256 dueDate) external {
        require(amount > 0, "Amount must be > 0");
        require(recipient != address(0), "Invalid recipient");

        uint256 invoiceId = nextInvoiceId++;
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            memo: memo,
            dueDate: dueDate,
            isPaid: false
        });

        emit InvoiceCreated(invoiceId, msg.sender, recipient, amount, memo, dueDate);
    }

    function payInvoice(uint256 invoiceId) external {
        Invoice storage invoice = invoices[invoiceId];
        require(invoice.id == invoiceId, "Invoice not found");
        require(!invoice.isPaid, "Already paid");
        require(msg.sender == invoice.sender, "Only sender can pay");

        invoice.isPaid = true;
        
        require(musdToken.transferFrom(msg.sender, invoice.recipient, invoice.amount), "Transfer failed");

        emit InvoicePaid(invoiceId, invoice.sender, invoice.recipient, invoice.amount);
    }
}

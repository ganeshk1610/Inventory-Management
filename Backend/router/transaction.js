const express = require("express");
const router = express.Router();
const transaction = require("../controller/transaction");

// Create a new transaction (main sales endpoint)
router.post("/create", transaction.createTransaction);

// Get transaction by transaction ID
router.get("/:transactionId", transaction.getTransaction);

// Get all transactions with filters
router.get("/", transaction.getTransactions);

// Get customer purchase history by phone number
router.get("/customer/:customerPhone", transaction.getCustomerHistory);

module.exports = router;
const Transaction = require("../models/transaction");
const Product = require("../models/Product");
const Customer = require("../models/customer");
const mongoose = require("mongoose");

// Create a new transaction
const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerPhone, items, userID } = req.body;

    // Validate customer phone
    if (!customerPhone || !/^\d{10}$/.test(customerPhone)) {
      return res.status(400).json({ error: "Valid 10-digit phone number is required" });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    let totalAmount = 0;
    let totalItems = 0;
    const processedItems = [];

    // Process each item
    for (const item of items) {
      const { productId, quantity } = item;

      // Find product
      const product = await Product.findById(productId).session(session);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Check stock availability
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`);
      }

      // Calculate prices
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;

      // Update product stock
      product.stock -= quantity;
      await product.save({ session });

      // Prepare item for transaction
      const processedItem = {
        productId: product._id,
        productName: product.name,
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        manufacturer: product.manufacturer
      };

      processedItems.push(processedItem);
      totalAmount += totalPrice;
      totalItems += quantity;
    }

    // Create transaction
    const transaction = new Transaction({
      customerPhone,
      items: processedItems,
      totalAmount,
      totalItems,
      userID,
      status: 'completed'
    });

    await transaction.save({ session });

    // Update or create customer record
    let customer = await Customer.findOne({ phoneNumber: customerPhone }).session(session);
    
    if (!customer) {
      customer = new Customer({
        phoneNumber: customerPhone,
        totalPurchases: totalItems,
        totalSpent: totalAmount,
        totalTransactions: 1,
        loyaltyPoints: Math.floor(totalAmount / 100) // 1 point per 100 currency units
      });
    } else {
      customer.totalPurchases += totalItems;
      customer.totalSpent += totalAmount;
      customer.totalTransactions += 1;
      customer.loyaltyPoints += Math.floor(totalAmount / 100);
      customer.lastPurchaseDate = new Date();
    }

    // Update loyalty tier
    customer.updateLoyaltyTier();
    await customer.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      transaction: await Transaction.findById(transaction._id).populate('items.productId'),
      customer: {
        phoneNumber: customer.phoneNumber,
        loyaltyTier: customer.loyaltyTier,
        loyaltyPoints: customer.loyaltyPoints,
        totalSpent: customer.totalSpent
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction error:', error);
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Get transaction by ID
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      transactionId: req.params.transactionId 
    }).populate('items.productId').populate('userID');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions with filters
const getTransactions = async (req, res) => {
  try {
    const { 
      userID, 
      customerPhone, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20,
      sortBy = 'saleDate',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    if (userID) filter.userID = userID;
    if (customerPhone) filter.customerPhone = customerPhone;
    
    if (startDate || endDate) {
      filter.saleDate = {};
      if (startDate) filter.saleDate.$gte = new Date(startDate);
      if (endDate) filter.saleDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const transactions = await Transaction.find(filter)
      .populate('items.productId')
      .populate('userID')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get customer purchase history
const getCustomerHistory = async (req, res) => {
  try {
    const { customerPhone } = req.params;

    const customer = await Customer.findOne({ phoneNumber: customerPhone });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const transactions = await Transaction.find({ customerPhone })
      .populate('items.productId')
      .sort({ saleDate: -1 });

    res.json({
      customer,
      transactions,
      summary: {
        totalTransactions: customer.totalTransactions,
        totalSpent: customer.totalSpent,
        totalItems: customer.totalPurchases,
        loyaltyTier: customer.loyaltyTier,
        loyaltyPoints: customer.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('Get customer history error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  getTransactions,
  getCustomerHistory
};
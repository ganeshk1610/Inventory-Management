const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    customerPhone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0
      },
      manufacturer: {
        type: String,
        required: true
      }
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    totalItems: {
      type: Number,
      required: true,
      min: 1
    },
    saleDate: {
      type: Date,
      default: Date.now
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'completed'
    }
  },
  { timestamps: true }
);

// Index for faster queries
TransactionSchema.index({ customerPhone: 1 });
TransactionSchema.index({ saleDate: -1 });
TransactionSchema.index({ 'items.productId': 1 });
TransactionSchema.index({ 'items.manufacturer': 1 });

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
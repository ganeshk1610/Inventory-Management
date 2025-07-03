const mongoose = require("mongoose");

const SaleTransactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [{
      productID: {
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
        min: 1,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'digital_wallet', 'bank_transfer', 'check', 'other'],
      default: 'cash',
    },
    customerInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    transactionDate: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled', 'refunded'],
      default: 'completed',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total items count
SaleTransactionSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for unique products count
SaleTransactionSchema.virtual('uniqueProducts').get(function() {
  return this.items.length;
});

// Pre-save middleware to generate receipt number
SaleTransactionSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    this.receiptNumber = `RCP-${dateStr}-${timeStr}`;
  }
  next();
});

// Index for faster queries
SaleTransactionSchema.index({ userID: 1, transactionDate: -1 });
SaleTransactionSchema.index({ timestamp: -1 });
SaleTransactionSchema.index({ receiptNumber: 1 });

const SaleTransaction = mongoose.model("SaleTransaction", SaleTransactionSchema);
module.exports = SaleTransaction;
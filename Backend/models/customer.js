const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    totalTransactions: {
      type: Number,
      default: 0
    },
    firstPurchaseDate: {
      type: Date,
      default: Date.now
    },
    lastPurchaseDate: {
      type: Date,
      default: Date.now
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    loyaltyTier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for faster queries
CustomerSchema.index({ phoneNumber: 1 });
CustomerSchema.index({ loyaltyTier: 1 });
CustomerSchema.index({ totalSpent: -1 });

// Method to update loyalty tier based on spending
CustomerSchema.methods.updateLoyaltyTier = function() {
  if (this.totalSpent >= 50000) {
    this.loyaltyTier = 'Platinum';
  } else if (this.totalSpent >= 25000) {
    this.loyaltyTier = 'Gold';
  } else if (this.totalSpent >= 10000) {
    this.loyaltyTier = 'Silver';
  } else {
    this.loyaltyTier = 'Bronze';
  }
};

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
const Transaction = require("../models/transaction");
const Product = require("../models/Product");
const Customer = require("../models/customer");

// Get most sold products
const getMostSoldProducts = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.saleDate = {};
      if (startDate) matchStage.saleDate.$gte = new Date(startDate);
      if (endDate) matchStage.saleDate.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          manufacturer: { $first: "$items.manufacturer" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
          totalTransactions: { $sum: 1 },
          averagePrice: { $avg: "$items.unitPrice" }
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: parseInt(limit) }
    ];

    const mostSoldProducts = await Transaction.aggregate(pipeline);
    
    res.json({
      success: true,
      data: mostSoldProducts,
      title: "Most Sold Products"
    });
  } catch (error) {
    console.error('Most sold products error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get least demand products
const getLeastDemandProducts = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    
    // Get all products
    const allProducts = await Product.find({}, '_id name manufacturer price stock');
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.saleDate = {};
      if (startDate) matchStage.saleDate.$gte = new Date(startDate);
      if (endDate) matchStage.saleDate.$lte = new Date(endDate);
    }

    // Get sold products data
    const soldProductsData = await Transaction.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" }
        }
      }
    ]);

    // Create a map for quick lookup
    const soldMap = new Map();
    soldProductsData.forEach(item => {
      soldMap.set(item._id.toString(), item);
    });

    // Combine with all products
    const leastDemandProducts = allProducts.map(product => {
      const soldData = soldMap.get(product._id.toString());
      return {
        _id: product._id,
        productName: product.name,
        manufacturer: product.manufacturer,
        price: product.price,
        currentStock: product.stock,
        totalQuantitySold: soldData ? soldData.totalQuantitySold : 0,
        totalRevenue: soldData ? soldData.totalRevenue : 0
      };
    });

    // Sort by least sold and limit
    leastDemandProducts.sort((a, b) => a.totalQuantitySold - b.totalQuantitySold);
    
    res.json({
      success: true,
      data: leastDemandProducts.slice(0, parseInt(limit)),
      title: "Least Demand Products"
    });
  } catch (error) {
    console.error('Least demand products error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get manufacturer analytics
const getManufacturerAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.saleDate = {};
      if (startDate) matchStage.saleDate.$gte = new Date(startDate);
      if (endDate) matchStage.saleDate.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.manufacturer",
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
          totalTransactions: { $sum: 1 },
          uniqueProducts: { $addToSet: "$items.productId" },
          averageOrderValue: { $avg: "$items.totalPrice" }
        }
      },
      {
        $addFields: {
          uniqueProductCount: { $size: "$uniqueProducts" }
        }
      },
      {
        $project: {
          uniqueProducts: 0 // Remove this field from output
        }
      },
      { $sort: { totalRevenue: -1 } }
    ];

    const manufacturerAnalytics = await Transaction.aggregate(pipeline);
    
    res.json({
      success: true,
      data: manufacturerAnalytics,
      title: "Manufacturer Analytics"
    });
  } catch (error) {
    console.error('Manufacturer analytics error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get customer loyalty analytics
const getCustomerLoyaltyAnalytics = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Top customers by spending
    const topCustomers = await Customer.find({ isActive: true })
      .sort({ totalSpent: -1 })
      .limit(parseInt(limit));

    // Loyalty tier distribution
    const loyaltyDistribution = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$loyaltyTier",
          count: { $sum: 1 },
          totalSpent: { $sum: "$totalSpent" },
          averageSpent: { $avg: "$totalSpent" }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    // Recent customers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCustomers = await Customer.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true
    });

    // Customer retention metrics
    const customerRetention = await Transaction.aggregate([
      {
        $group: {
          _id: "$customerPhone",
          transactionCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          firstTransaction: { $min: "$saleDate" },
          lastTransaction: { $max: "$saleDate" }
        }
      },
      {
        $group: {
          _id: null,
          averageTransactionsPerCustomer: { $avg: "$transactionCount" },
          oneTimeCustomers: {
            $sum: { $cond: [{ $eq: ["$transactionCount", 1] }, 1, 0] }
          },
          repeatCustomers: {
            $sum: { $cond: [{ $gt: ["$transactionCount", 1] }, 1, 0] }
          },
          totalCustomers: { $sum: 1 }
        }
      }
    ]);

    const retentionData = customerRetention[0] || {
      averageTransactionsPerCustomer: 0,
      oneTimeCustomers: 0,
      repeatCustomers: 0,
      totalCustomers: 0
    };

    const retentionRate = retentionData.totalCustomers > 0 ? 
      (retentionData.repeatCustomers / retentionData.totalCustomers * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        topCustomers,
        loyaltyDistribution,
        recentCustomers,
        retentionMetrics: {
          ...retentionData,
          retentionRate: `${retentionRate}%`
        }
      },
      title: "Customer Loyalty Analytics"
    });
  } catch (error) {
    console.error('Customer loyalty analytics error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get sales overview dashboard
const getSalesOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.saleDate = {};
      if (startDate) matchStage.saleDate.$gte = new Date(startDate);
      if (endDate) matchStage.saleDate.$lte = new Date(endDate);
    }

    // Total sales metrics
    const salesMetrics = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
          totalItemsSold: { $sum: "$totalItems" },
          averageOrderValue: { $avg: "$totalAmount" }
        }
      }
    ]);

    // Daily sales trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await Transaction.aggregate([
      {
        $match: {
          saleDate: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$saleDate"
            }
          },
          dailyRevenue: { $sum: "$totalAmount" },
          dailyTransactions: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Low stock alerts
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name manufacturer stock price')
      .sort({ stock: 1 });

    const metrics = salesMetrics[0] || {
      totalRevenue: 0,
      totalTransactions: 0,
      totalItemsSold: 0,
      averageOrderValue: 0
    };

    res.json({
      success: true,
      data: {
        overview: metrics,
        dailySales,
        lowStockAlerts: lowStockProducts
      },
      title: "Sales Overview Dashboard"
    });
  } catch (error) {
    console.error('Sales overview error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get monthly sales comparison
const getMonthlySalesComparison = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const monthlySales = await Transaction.aggregate([
      {
        $match: {
          saleDate: {
            $gte: new Date(`${previousYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$saleDate" },
            month: { $month: "$saleDate" }
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
          totalItems: { $sum: "$totalItems" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      success: true,
      data: monthlySales,
      title: "Monthly Sales Comparison"
    });
  } catch (error) {
    console.error('Monthly sales comparison error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get revenue by category/manufacturer
const getRevenueByCategory = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'manufacturer' } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.saleDate = {};
      if (startDate) matchStage.saleDate.$gte = new Date(startDate);
      if (endDate) matchStage.saleDate.$lte = new Date(endDate);
    }

    const groupField = groupBy === 'manufacturer' ? "$items.manufacturer" : "$items.category";

    const pipeline = [
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: groupField,
          totalRevenue: { $sum: "$items.totalPrice" },
          totalQuantity: { $sum: "$items.quantity" },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ];

    const revenueData = await Transaction.aggregate(pipeline);
    
    res.json({
      success: true,
      data: revenueData,
      title: `Revenue by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`
    });
  } catch (error) {
    console.error('Revenue by category error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMostSoldProducts,
  getLeastDemandProducts,
  getManufacturerAnalytics,
  getCustomerLoyaltyAnalytics,
  getSalesOverview,
  getMonthlySalesComparison,
  getRevenueByCategory
};
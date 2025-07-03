const Sales = require("../models/sales");
const SaleTransaction = require("../models/saleTransaction");
const soldStock = require("../controller/soldStock");
const Product = require("../models/product");

// Create Sale Transaction (Multiple products in one transaction)
const createSaleTransaction = async (req, res) => {
  try {
    const { userID, items, paymentMethod, customerInfo } = req.body;
    
    let totalAmount = 0;
    const transactionItems = [];
    
    // Validate and calculate total for each item
    for (const item of items) {
      const product = await Product.findById(item.productID);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productID}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      transactionItems.push({
        productID: item.productID,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal
      });
    }
    
    // Create transaction
    const transaction = new SaleTransaction({
      userID,
      items: transactionItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      customerInfo: customerInfo || {},
      transactionDate: new Date().toISOString().split('T')[0],
      timestamp: new Date()
    });
    
    const savedTransaction = await transaction.save();
    
    // Update individual sales records and stock
    for (const item of items) {
      const product = await Product.findById(item.productID);
      
      // Create individual sale record
      const sale = new Sales({
        userID,
        ProductID: item.productID,
        Category: product.category || 'General',
        StockSold: item.quantity,
        SaleDate: new Date().toISOString().split('T')[0],
        TotalSaleAmount: product.price * item.quantity,
        transactionID: savedTransaction._id
      });
      
      await sale.save();
      
      // Update stock
      if (soldStock) {
        soldStock(item.productID, item.quantity);
      }
    }
    
    res.status(201).json({
      success: true,
      transaction: savedTransaction,
      message: 'Sale transaction completed successfully'
    });
    
  } catch (error) {
    console.error('Error creating sale transaction:', error);
    res.status(500).json({ error: 'Failed to create sale transaction' });
  }
};

// Get specific sale transaction
const getSaleTransaction = async (req, res) => {
  try {
    const transaction = await SaleTransaction.findById(req.params.transactionId)
      .populate('userID', 'firstName lastName email')
      .populate('items.productID');
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Get all transactions for a user
const getAllTransactions = async (req, res) => {
  try {
    const { userID } = req.params;
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    
    let query = { userID };
    
    if (startDate && endDate) {
      query.transactionDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const transactions = await SaleTransaction.find(query)
      .populate('items.productID', 'name manufacturer')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await SaleTransaction.countDocuments(query);
    
    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get products sold with details
const getProductsSold = async (req, res) => {
  try {
    const { userID } = req.params;
    const { startDate, endDate } = req.query;
    
    let matchQuery = { userID };
    
    if (startDate && endDate) {
      matchQuery.SaleDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    const productsSold = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$ProductID',
          totalQuantitySold: { $sum: '$StockSold' },
          totalRevenue: { $sum: '$TotalSaleAmount' },
          salesCount: { $sum: 1 },
          lastSaleDate: { $max: '$SaleDate' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $project: {
          productName: '$productDetails.name',
          manufacturer: '$productDetails.manufacturer',
          currentPrice: '$productDetails.price',
          currentStock: '$productDetails.stock',
          totalQuantitySold: 1,
          totalRevenue: 1,
          salesCount: 1,
          lastSaleDate: 1,
          averageRevenuePerSale: { $divide: ['$totalRevenue', '$salesCount'] }
        }
      },
      { $sort: { totalQuantitySold: -1 } }
    ]);
    
    res.json(productsSold);
  } catch (error) {
    console.error('Error fetching products sold:', error);
    res.status(500).json({ error: 'Failed to fetch products sold data' });
  }
};

// Get products sold today
const getProductsSoldToday = async (req, res) => {
  try {
    const { userID } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    const productsSoldToday = await Sales.find({
      userID,
      SaleDate: today
    }).populate('ProductID', 'name manufacturer price stock');
    
    // Group by product
    const groupedProducts = {};
    productsSoldToday.forEach(sale => {
      const productId = sale.ProductID._id.toString();
      if (!groupedProducts[productId]) {
        groupedProducts[productId] = {
          product: sale.ProductID,
          totalQuantitySold: 0,
          totalRevenue: 0,
          salesCount: 0
        };
      }
      groupedProducts[productId].totalQuantitySold += sale.StockSold;
      groupedProducts[productId].totalRevenue += sale.TotalSaleAmount;
      groupedProducts[productId].salesCount += 1;
    });
    
    const result = Object.values(groupedProducts);
    res.json(result);
  } catch (error) {
    console.error('Error fetching today\'s products sold:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s products sold' });
  }
};

// Get products sold by period
const getProductsSoldByPeriod = async (req, res) => {
  try {
    const { userID } = req.params;
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = '%Y-%m';
        break;
      case 'year':
        groupFormat = '%Y';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }
    
    const salesByPeriod = await Sales.aggregate([
      {
        $match: {
          userID,
          SaleDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            period: { $dateFromString: { dateString: '$SaleDate' } },
            productID: '$ProductID'
          },
          totalQuantitySold: { $sum: '$StockSold' },
          totalRevenue: { $sum: '$TotalSaleAmount' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id.productID',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$_id.period' } },
          products: {
            $push: {
              productName: '$productDetails.name',
              manufacturer: '$productDetails.manufacturer',
              quantitySold: '$totalQuantitySold',
              revenue: '$totalRevenue'
            }
          },
          totalPeriodRevenue: { $sum: '$totalRevenue' },
          totalPeriodQuantity: { $sum: '$totalQuantitySold' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json(salesByPeriod);
  } catch (error) {
    console.error('Error fetching products sold by period:', error);
    res.status(500).json({ error: 'Failed to fetch products sold by period' });
  }
};

// Get daily sales
const getDailySales = async (req, res) => {
  try {
    const { userID } = req.params;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const dailySales = await Sales.aggregate([
      {
        $match: {
          userID,
          SaleDate: { $gte: startDate.toISOString().split('T')[0] }
        }
      },
      {
        $group: {
          _id: '$SaleDate',
          totalRevenue: { $sum: '$TotalSaleAmount' },
          totalItemsSold: { $sum: '$StockSold' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    res.json(dailySales);
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    res.status(500).json({ error: 'Failed to fetch daily sales' });
  }
};

// Get low stock products based on sales velocity
const getLowStockProducts = async (req, res) => {
  try {
    const { userID } = req.params;
    const { threshold = 10 } = req.query;
    
    // Get products with low stock
    const lowStockProducts = await Product.find({
      stock: { $lte: threshold }
    });
    
    // Get sales data for these products to calculate velocity
    const productIds = lowStockProducts.map(p => p._id);
    const recentSales = await Sales.aggregate([
      {
        $match: {
          userID,
          ProductID: { $in: productIds },
          SaleDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        }
      },
      {
        $group: {
          _id: '$ProductID',
          totalSold: { $sum: '$StockSold' },
          salesCount: { $sum: 1 }
        }
      }
    ]);
    
    const result = lowStockProducts.map(product => {
      const salesData = recentSales.find(s => s._id.toString() === product._id.toString());
      return {
        ...product.toObject(),
        salesVelocity: salesData ? salesData.totalSold / 30 : 0, // items per day
        estimatedDaysLeft: salesData && salesData.totalSold > 0 ? 
          Math.floor(product.stock / (salesData.totalSold / 30)) : null
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
};

// Original functions (keeping for backward compatibility)
// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    Category: req.body.category,
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    TotalSaleAmount: req.body.totalSaleAmount,
  });

  addSale
    .save()
    .then((result) => {
      if (soldStock) {
        soldStock(req.body.productID, req.body.stockSold);
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  try {
    const findAllSalesData = await Sales.find({ userID: req.params.userID })
      .sort({ _id: -1 })
      .populate("ProductID");
    res.json(findAllSalesData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  try {
    let totalSaleAmount = 0;
    const salesData = await Sales.find({ userID: req.params.userID });
    salesData.forEach((sale) => {
      totalSaleAmount += sale.TotalSaleAmount;
    });
    res.json({ totalSaleAmount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate total sales amount' });
  }
};

// Get Monthly Sales
const getMonthlySales = async (req, res) => {
  try {
    const { userID } = req.params;
    const sales = await Sales.find({ userID });

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0);

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        salesAmount[monthIndex] += sale.TotalSaleAmount;
      }
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Search products for POS
const searchProduct = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { manufacturer: { $regex: searchTerm, $options: "i" } },
        { barcodes: { $in: [searchTerm] } }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
};

module.exports = {
  // New POS functions
  createSaleTransaction,
  getSaleTransaction,
  getAllTransactions,
  getProductsSold,
  getProductsSoldToday,
  getProductsSoldByPeriod,
  getDailySales,
  getLowStockProducts,
  
  // Original functions
  addSales,
  getMonthlySales,
  getSalesData,
  getTotalSalesAmount,
  searchProduct,
};

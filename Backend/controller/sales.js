const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const Product = require("../models/Product");
// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    Category: req.body.category, // Updated to use 'category' instead of 'storeID'
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    TotalSaleAmount: req.body.totalSaleAmount,
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productID, req.body.stockSold);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({ userID: req.params.userID })
    .sort({ _id: -1 })
    .populate("ProductID"); // Removed 'StoreID'
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({ userID: req.params.userID });
  salesData.forEach((sale) => {
    totalSaleAmount += sale.TotalSaleAmount;
  });
  res.json({ totalSaleAmount });
};

// Get Monthly Sales
const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0);

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;
      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
};

module.exports = {
  addSales,
  getMonthlySales,
  getSalesData,
  getTotalSalesAmount,
  searchProduct,
};

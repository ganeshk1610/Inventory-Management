const express = require("express");
const router = express.Router();
const sales = require("../controller/sales");

// Sales Transaction Management
router.post("/transaction", sales.createSaleTransaction);
router.get("/transaction/:transactionId", sales.getSaleTransaction);
router.get("/transactions/:userID", sales.getAllTransactions);

// Individual Sales Management
router.post("/add", sales.addSales);
router.get("/get/:userID", sales.getSalesData);

// Products Sold Analytics
router.get("/products-sold/:userID", sales.getProductsSold);
router.get("/products-sold/:userID/today", sales.getProductsSoldToday);
router.get("/products-sold/:userID/period", sales.getProductsSoldByPeriod);

// Sales Analytics
router.get("/analytics/:userID/daily", sales.getDailySales);
router.get("/analytics/:userID/monthly", sales.getMonthlySales);
router.get("/analytics/:userID/total", sales.getTotalSalesAmount);

// Product Search for POS
router.get("/search-products", sales.searchProduct);

// Inventory Impact
router.get("/low-stock/:userID", sales.getLowStockProducts);

module.exports = router;

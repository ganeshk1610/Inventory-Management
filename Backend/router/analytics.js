const express = require("express");
const router = express.Router();
const analytics = require("../controller/analytics");

// Most sold products
router.get("/most-sold", analytics.getMostSoldProducts);

// Least demand products
router.get("/least-demand", analytics.getLeastDemandProducts);

// Manufacturer analytics
router.get("/manufacturers", analytics.getManufacturerAnalytics);

// Customer loyalty analytics
router.get("/customer-loyalty", analytics.getCustomerLoyaltyAnalytics);

// Sales overview dashboard
router.get("/overview", analytics.getSalesOverview);

// Monthly sales comparison
router.get("/monthly-comparison", analytics.getMonthlySalesComparison);

// Revenue by category/manufacturer
router.get("/revenue-by-category", analytics.getRevenueByCategory);

module.exports = router;
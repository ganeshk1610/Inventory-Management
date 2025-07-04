# Sales Transaction & Analytics API Documentation

## Overview

This comprehensive sales API provides complete transaction management with automatic inventory updates, customer loyalty tracking, and advanced analytics. Every transaction generates a unique transaction ID and tracks customer information through phone numbers for loyalty programs.

## Base URL
```
http://localhost:4000/api
```

## Authentication
All endpoints require user authentication. Include the `userID` in request body or as query parameter.

---

## 🛒 Transaction Management

### Create Transaction (Main Sales Endpoint)
**POST** `/transaction/create`

Creates a complete sales transaction with automatic inventory updates and customer loyalty tracking.

#### Request Body:
```json
{
  "customerPhone": "1234567890",
  "userID": "64298b2e5434138eda1234",
  "items": [
    {
      "productId": "64298b2e5434138eda1564",
      "quantity": 2
    },
    {
      "productId": "64298b2e5434138eda1565",
      "quantity": 1
    }
  ]
}
```

#### Response:
```json
{
  "success": true,
  "transaction": {
    "transactionId": "TXN-1703123456789-abc123def",
    "customerPhone": "1234567890",
    "items": [
      {
        "productId": "64298b2e5434138eda1564",
        "productName": "iPhone 14",
        "quantity": 2,
        "unitPrice": 999.99,
        "totalPrice": 1999.98,
        "manufacturer": "Apple"
      }
    ],
    "totalAmount": 1999.98,
    "totalItems": 2,
    "saleDate": "2023-12-21T10:30:00.000Z",
    "status": "completed"
  },
  "customer": {
    "phoneNumber": "1234567890",
    "loyaltyTier": "Silver",
    "loyaltyPoints": 199,
    "totalSpent": 1999.98
  }
}
```

### Get Transaction by ID
**GET** `/transaction/{transactionId}`

#### Response:
```json
{
  "transactionId": "TXN-1703123456789-abc123def",
  "customerPhone": "1234567890",
  "items": [...],
  "totalAmount": 1999.98,
  "saleDate": "2023-12-21T10:30:00.000Z"
}
```

### Get All Transactions
**GET** `/transaction`

#### Query Parameters:
- `userID` - Filter by user
- `customerPhone` - Filter by customer
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: saleDate)
- `sortOrder` - Sort order: asc/desc (default: desc)

#### Example:
```
GET /transaction?userID=64298b2e5434138eda1234&startDate=2023-12-01&limit=10
```

### Get Customer Purchase History
**GET** `/transaction/customer/{customerPhone}`

#### Response:
```json
{
  "customer": {
    "phoneNumber": "1234567890",
    "loyaltyTier": "Gold",
    "totalSpent": 5999.97,
    "totalTransactions": 5
  },
  "transactions": [...],
  "summary": {
    "totalTransactions": 5,
    "totalSpent": 5999.97,
    "totalItems": 15,
    "loyaltyTier": "Gold",
    "loyaltyPoints": 599
  }
}
```

---

## 📊 Analytics Endpoints

### Sales Overview Dashboard
**GET** `/analytics/overview`

Provides comprehensive sales metrics and dashboard data.

#### Query Parameters:
- `startDate` - Start date filter
- `endDate` - End date filter

#### Response:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": 125670.50,
      "totalTransactions": 458,
      "totalItemsSold": 1247,
      "averageOrderValue": 274.50
    },
    "dailySales": [
      {
        "_id": "2023-12-20",
        "dailyRevenue": 2450.99,
        "dailyTransactions": 12
      }
    ],
    "lowStockAlerts": [
      {
        "name": "iPhone 14",
        "manufacturer": "Apple",
        "stock": 3,
        "price": 999.99
      }
    ]
  }
}
```

### Most Sold Products
**GET** `/analytics/most-sold`

#### Query Parameters:
- `limit` - Number of products (default: 10)
- `startDate` - Filter start date
- `endDate` - Filter end date

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64298b2e5434138eda1564",
      "productName": "iPhone 14",
      "manufacturer": "Apple",
      "totalQuantitySold": 145,
      "totalRevenue": 144999.55,
      "totalTransactions": 98,
      "averagePrice": 999.99
    }
  ]
}
```

### Least Demand Products
**GET** `/analytics/least-demand`

Shows products with lowest sales or no sales.

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64298b2e5434138eda1567",
      "productName": "Old Phone Model",
      "manufacturer": "Samsung",
      "price": 299.99,
      "currentStock": 25,
      "totalQuantitySold": 0,
      "totalRevenue": 0
    }
  ]
}
```

### Manufacturer Analytics
**GET** `/analytics/manufacturers`

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "Apple",
      "totalQuantitySold": 245,
      "totalRevenue": 234550.75,
      "totalTransactions": 156,
      "uniqueProductCount": 8,
      "averageOrderValue": 1503.53
    }
  ]
}
```

### Customer Loyalty Analytics
**GET** `/analytics/customer-loyalty`

#### Query Parameters:
- `limit` - Number of top customers (default: 20)

#### Response:
```json
{
  "success": true,
  "data": {
    "topCustomers": [
      {
        "phoneNumber": "1234567890",
        "totalSpent": 15650.75,
        "totalTransactions": 25,
        "loyaltyTier": "Platinum",
        "loyaltyPoints": 1565
      }
    ],
    "loyaltyDistribution": [
      {
        "_id": "Platinum",
        "count": 15,
        "totalSpent": 187540.25,
        "averageSpent": 12502.68
      }
    ],
    "recentCustomers": 45,
    "retentionMetrics": {
      "averageTransactionsPerCustomer": 3.2,
      "oneTimeCustomers": 234,
      "repeatCustomers": 156,
      "totalCustomers": 390,
      "retentionRate": "40.00%"
    }
  }
}
```

### Monthly Sales Comparison
**GET** `/analytics/monthly-comparison`

Compares current year vs previous year monthly sales.

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "year": 2023,
        "month": 12
      },
      "totalRevenue": 45670.25,
      "totalTransactions": 156,
      "totalItems": 467
    }
  ]
}
```

### Revenue by Category/Manufacturer
**GET** `/analytics/revenue-by-category`

#### Query Parameters:
- `groupBy` - Group by 'manufacturer' or 'category' (default: manufacturer)
- `startDate` - Filter start date
- `endDate` - Filter end date

#### Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "Apple",
      "totalRevenue": 234550.75,
      "totalQuantity": 245,
      "transactionCount": 156
    }
  ]
}
```

---

## 🎯 Key Features

### Automatic Inventory Management
- ✅ Stock automatically updated when sales are processed
- ✅ Stock validation prevents overselling
- ✅ Low stock alerts in analytics
- ✅ Transaction rollback on inventory errors

### Customer Loyalty System
- ✅ Phone number-based customer tracking
- ✅ Automatic loyalty tier calculation (Bronze, Silver, Gold, Platinum)
- ✅ Loyalty points earned (1 point per 100 currency units)
- ✅ Purchase history tracking
- ✅ Customer retention analytics

### Transaction Management
- ✅ Unique transaction ID generation
- ✅ Multi-item transactions support
- ✅ Complete transaction audit trail
- ✅ Database transaction safety (rollback on errors)

### Advanced Analytics
- ✅ Real-time sales metrics
- ✅ Product performance analysis
- ✅ Manufacturer comparison
- ✅ Customer behavior insights
- ✅ Sales trends and patterns
- ✅ Revenue breakdowns

---

## 📋 Transaction Schema

Each transaction contains:

- **transactionId**: Unique identifier (auto-generated)
- **customerPhone**: 10-digit phone number
- **items**: Array of purchased items with:
  - productId, productName, quantity, unitPrice, totalPrice, manufacturer
- **totalAmount**: Total transaction value
- **totalItems**: Total quantity of items
- **saleDate**: Transaction timestamp
- **userID**: User who processed the sale
- **status**: Transaction status (completed/pending/cancelled)

## 📋 Customer Schema

Customer loyalty tracking includes:

- **phoneNumber**: Unique 10-digit identifier
- **personalInfo**: firstName, lastName, email (optional)
- **purchaseMetrics**: totalPurchases, totalSpent, totalTransactions
- **loyaltyData**: loyaltyPoints, loyaltyTier
- **timestamps**: firstPurchaseDate, lastPurchaseDate

---

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   cd Backend
   npm install
   npm start
   ```

2. **Create your first transaction:**
   ```bash
   curl -X POST http://localhost:4000/api/transaction/create \
   -H "Content-Type: application/json" \
   -d '{
     "customerPhone": "1234567890",
     "userID": "your_user_id",
     "items": [
       {
         "productId": "product_id",
         "quantity": 2
       }
     ]
   }'
   ```

3. **View analytics:**
   ```bash
   curl http://localhost:4000/api/analytics/overview
   ```

## 🔧 Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message description",
  "details": "Additional error details if applicable"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for new transactions)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 📱 Integration Examples

### Frontend Integration
```javascript
// Create a transaction
const createTransaction = async (customerPhone, items, userID) => {
  const response = await fetch('/api/transaction/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerPhone,
      items,
      userID
    })
  });
  return response.json();
};

// Get analytics
const getAnalytics = async () => {
  const response = await fetch('/api/analytics/overview');
  return response.json();
};
```

This API provides a complete solution for modern retail operations with comprehensive transaction management, customer loyalty tracking, and business intelligence through advanced analytics.
# Point of Sale Sales API Documentation

This API provides comprehensive functionality for managing sales transactions, tracking sold products, and generating analytics for a Point of Sale (POS) system.

## Base URL
```
http://localhost:4000/api/sales
```

## Endpoints Overview

### 1. Sales Transaction Management

#### Create Sale Transaction
**POST** `/transaction`

Creates a complete sale transaction with multiple products.

**Request Body:**
```json
{
  "userID": "64a7b8c9d1e2f3a4b5c6d7e8",
  "items": [
    {
      "productID": "64a7b8c9d1e2f3a4b5c6d7e9",
      "quantity": 2
    },
    {
      "productID": "64a7b8c9d1e2f3a4b5c6d7ea",
      "quantity": 1
    }
  ],
  "paymentMethod": "card",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7eb",
    "userID": "64a7b8c9d1e2f3a4b5c6d7e8",
    "items": [
      {
        "productID": "64a7b8c9d1e2f3a4b5c6d7e9",
        "productName": "Product A",
        "quantity": 2,
        "unitPrice": 25.99,
        "totalPrice": 51.98
      }
    ],
    "totalAmount": 76.97,
    "receiptNumber": "RCP-20231215-123456",
    "timestamp": "2023-12-15T10:30:00.000Z"
  },
  "message": "Sale transaction completed successfully"
}
```

#### Get Specific Transaction
**GET** `/transaction/:transactionId`

**Response:**
```json
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7eb",
  "userID": {
    "firstName": "Store",
    "lastName": "Owner",
    "email": "owner@store.com"
  },
  "items": [...],
  "totalAmount": 76.97,
  "receiptNumber": "RCP-20231215-123456"
}
```

#### Get All Transactions
**GET** `/transactions/:userID`

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Start date filter (YYYY-MM-DD)
- `endDate` (optional): End date filter (YYYY-MM-DD)

**Response:**
```json
{
  "transactions": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 95
}
```

### 2. Products Sold Analytics

#### Get All Products Sold
**GET** `/products-sold/:userID`

Returns detailed analytics about products sold with quantities, revenue, and performance metrics.

Query Parameters:
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

**Response:**
```json
[
  {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "productName": "Product A",
    "manufacturer": "Company XYZ",
    "currentPrice": 25.99,
    "currentStock": 45,
    "totalQuantitySold": 150,
    "totalRevenue": 3898.50,
    "salesCount": 75,
    "lastSaleDate": "2023-12-15",
    "averageRevenuePerSale": 51.98
  }
]
```

#### Get Products Sold Today
**GET** `/products-sold/:userID/today`

**Response:**
```json
[
  {
    "product": {
      "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "name": "Product A",
      "manufacturer": "Company XYZ",
      "price": 25.99,
      "stock": 45
    },
    "totalQuantitySold": 8,
    "totalRevenue": 207.92,
    "salesCount": 4
  }
]
```

#### Get Products Sold by Period
**GET** `/products-sold/:userID/period`

Query Parameters:
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)
- `groupBy` (optional): 'day', 'month', or 'year' (default: 'day')

**Response:**
```json
[
  {
    "_id": "2023-12-15",
    "products": [
      {
        "productName": "Product A",
        "manufacturer": "Company XYZ",
        "quantitySold": 8,
        "revenue": 207.92
      }
    ],
    "totalPeriodRevenue": 525.50,
    "totalPeriodQuantity": 20
  }
]
```

### 3. Sales Analytics

#### Get Daily Sales
**GET** `/analytics/:userID/daily`

Query Parameters:
- `days` (optional): Number of days to look back (default: 30)

**Response:**
```json
[
  {
    "_id": "2023-12-15",
    "totalRevenue": 525.50,
    "totalItemsSold": 20,
    "transactionCount": 8
  }
]
```

#### Get Monthly Sales
**GET** `/analytics/:userID/monthly`

**Response:**
```json
{
  "salesAmount": [1250.50, 1890.75, 2150.25, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}
```

#### Get Total Sales Amount
**GET** `/analytics/:userID/total`

**Response:**
```json
{
  "totalSaleAmount": 15750.25
}
```

### 4. Product Search for POS

#### Search Products
**GET** `/search-products`

Query Parameters:
- `searchTerm` (required): Search term for product name, manufacturer, or barcode

**Response:**
```json
[
  {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "name": "Product A",
    "manufacturer": "Company XYZ",
    "price": 25.99,
    "stock": 45,
    "barcodes": ["1234567890123"],
    "description": "Product description"
  }
]
```

### 5. Inventory Management

#### Get Low Stock Products
**GET** `/low-stock/:userID`

Query Parameters:
- `threshold` (optional): Stock threshold (default: 10)

**Response:**
```json
[
  {
    "_id": "64a7b8c9d1e2f3a4b5c6d7ea",
    "name": "Product B",
    "manufacturer": "Company ABC",
    "price": 15.50,
    "stock": 5,
    "salesVelocity": 0.5,
    "estimatedDaysLeft": 10
  }
]
```

### 6. Legacy Individual Sales Management

#### Add Individual Sale
**POST** `/add`

**Request Body:**
```json
{
  "userID": "64a7b8c9d1e2f3a4b5c6d7e8",
  "productID": "64a7b8c9d1e2f3a4b5c6d7e9",
  "category": "Electronics",
  "stockSold": 2,
  "saleDate": "2023-12-15",
  "totalSaleAmount": 51.98
}
```

#### Get All Sales Data
**GET** `/get/:userID`

Returns all individual sale records for a user.

## Example Usage Scenarios

### 1. Processing a Sale at POS
```bash
# Search for products
curl "http://localhost:4000/api/sales/search-products?searchTerm=laptop"

# Create transaction
curl -X POST http://localhost:4000/api/sales/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "user123",
    "items": [
      {"productID": "prod1", "quantity": 1},
      {"productID": "prod2", "quantity": 2}
    ],
    "paymentMethod": "card",
    "customerInfo": {"name": "John Doe"}
  }'
```

### 2. Daily Sales Report
```bash
# Get today's sold products
curl "http://localhost:4000/api/sales/products-sold/user123/today"

# Get daily sales analytics
curl "http://localhost:4000/api/sales/analytics/user123/daily?days=7"
```

### 3. Inventory Management
```bash
# Check low stock products
curl "http://localhost:4000/api/sales/low-stock/user123?threshold=5"

# Get products sold analytics
curl "http://localhost:4000/api/sales/products-sold/user123"
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created successfully
- `400` - Bad request / Validation error
- `404` - Resource not found
- `500` - Internal server error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Notes

- All dates should be in `YYYY-MM-DD` format
- MongoDB ObjectIDs should be valid 24-character hex strings
- The API automatically manages stock levels when sales are recorded
- Receipt numbers are automatically generated for transactions
- All monetary values are stored as numbers (not strings)
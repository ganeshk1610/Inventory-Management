// Test script to validate the Sales Transaction API
// Run this from the root directory with: node Backend/test_api.js
// Or from Backend directory with: node test_api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Sample test data
const testUserID = '64298b2e5434138eda1234';
const testCustomerPhone = '1234567890';

async function testAPI() {
  console.log('🧪 Testing Sales Transaction API...\n');

  try {
    // Test 1: Get analytics overview (should work even with no data)
    console.log('1. Testing Analytics Overview...');
    const overviewResponse = await axios.get(`${BASE_URL}/analytics/overview`);
    console.log('✅ Analytics Overview:', overviewResponse.data);
    console.log('');

    // Test 2: Get most sold products
    console.log('2. Testing Most Sold Products...');
    const mostSoldResponse = await axios.get(`${BASE_URL}/analytics/most-sold?limit=5`);
    console.log('✅ Most Sold Products:', mostSoldResponse.data);
    console.log('');

    // Test 3: Get least demand products
    console.log('3. Testing Least Demand Products...');
    const leastDemandResponse = await axios.get(`${BASE_URL}/analytics/least-demand?limit=5`);
    console.log('✅ Least Demand Products:', leastDemandResponse.data);
    console.log('');

    // Test 4: Get manufacturer analytics
    console.log('4. Testing Manufacturer Analytics...');
    const manufacturerResponse = await axios.get(`${BASE_URL}/analytics/manufacturers`);
    console.log('✅ Manufacturer Analytics:', manufacturerResponse.data);
    console.log('');

    // Test 5: Get customer loyalty analytics
    console.log('5. Testing Customer Loyalty Analytics...');
    const loyaltyResponse = await axios.get(`${BASE_URL}/analytics/customer-loyalty`);
    console.log('✅ Customer Loyalty Analytics:', loyaltyResponse.data);
    console.log('');

    // Test 6: Get monthly sales comparison
    console.log('6. Testing Monthly Sales Comparison...');
    const monthlyResponse = await axios.get(`${BASE_URL}/analytics/monthly-comparison`);
    console.log('✅ Monthly Sales Comparison:', monthlyResponse.data);
    console.log('');

    // Test 7: Get all transactions
    console.log('7. Testing Get All Transactions...');
    const transactionsResponse = await axios.get(`${BASE_URL}/transaction?limit=5`);
    console.log('✅ All Transactions:', transactionsResponse.data);
    console.log('');

    console.log('🎉 All API endpoints are working correctly!');
    console.log('\n📝 To create a test transaction, you\'ll need:');
    console.log('   1. A valid userID from your users collection');
    console.log('   2. Valid productId(s) from your products collection');
    console.log('   3. Use the POST /api/transaction/create endpoint');
    console.log('\nExample:');
    console.log(`curl -X POST ${BASE_URL}/transaction/create \\`);
    console.log('-H "Content-Type: application/json" \\');
    console.log('-d \'{"customerPhone": "1234567890", "userID": "your_user_id", "items": [{"productId": "your_product_id", "quantity": 1}]}\'');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Make sure the server is running on port 4000');
  }
}

// Note about axios dependency
console.log('📦 This test requires axios. Install it with: npm install axios');
console.log('🚀 Make sure your server is running on port 4000\n');

testAPI();
import React, { useState, useEffect } from "react";

const SalesOverview = ({ salesData }) => {
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-1542",
      customer: "John Doe",
      date: "2024-06-29",
      type: "Sale",
      amount: "$420.00",
      status: "Paid",
    },
    {
      id: "TXN-1543",
      customer: "Laurie Smith",
      date: "2024-06-29",
      type: "Subscription",
      amount: "$128.00",
      status: "Pending",
    },
    {
      id: "TXN-1544",
      customer: "Kevin Adams",
      date: "2024-06-29",
      type: "Refund",
      amount: "-$56.00",
      status: "Refunded",
    },
    {
      id: "TXN-1545",
      customer: "Maria Santos",
      date: "2024-06-29",
      type: "Sale",
      amount: "$230.00",
      status: "Paid",
    },
  ]);

  const [topProducts, setTopProducts] = useState([
    { name: "Blue Crew Tee", unitsSold: 364, revenue: "$7,284" },
    { name: "Indigo Joggers", unitsSold: 294, revenue: "$11,560" },
    { name: "Canvas Tote", unitsSold: 142, revenue: "$3,990" },
    { name: "Sky Ball Cap", unitsSold: 85, revenue: "$1,845" },
  ]);

  const calculateMetrics = () => {
    const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.TotalSaleAmount || 0), 0);
    const totalTransactions = salesData.length;
    const averageValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      monthlyRecurring: "$84,370",
      averageValue: `$${averageValue.toFixed(2)}`,
      customerCount: "2,391",
    };
  };

  const metrics = calculateMetrics();

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Billing Analytics</h1>
          <p className="text-gray-600">Collect transactions and optimize business dashboard</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search transactions, products..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalRevenue}</p>
              <p className="text-sm text-green-600">↗ 20% this month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Recurring</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.monthlyRecurring}</p>
              <p className="text-sm text-green-600">↗ 7% this month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-green-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageValue}</p>
              <p className="text-sm text-green-600">↗ 6.8%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Count</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.customerCount}</p>
              <p className="text-sm text-green-600">↗ 1.4% this month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-orange-600 text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comprehensive Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Comprehensive Transactions</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm">More Filters</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          {/* Daily Sales Trend */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Sales Trend</h3>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-blue-600 mb-2">📈</div>
                <p className="text-sm text-gray-600">Chart placeholder</p>
              </div>
            </div>
          </div>

          {/* Most Sold Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Most Sold Products</h3>
              <span className="text-sm text-gray-500">Top 4 products today</span>
            </div>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-gray-400 mb-2">🥧</div>
                <p className="text-sm text-gray-600">Pie chart</p>
              </div>
            </div>
          </div>

          {/* Most Active Hours */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Most Active Hours</h3>
              <span className="text-sm text-gray-500">By average sales</span>
            </div>
            <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl text-blue-600 mb-2">📊</div>
                <p className="text-sm text-gray-600">Bar chart</p>
              </div>
            </div>
          </div>

          {/* Sales By Category */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales By Category</h3>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg text-gray-400 mb-1">📊</div>
                <p className="text-xs text-gray-600">Donut</p>
              </div>
            </div>
          </div>

          {/* Best Sales Days */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Best Sales Days</h3>
              <span className="text-sm text-gray-500">By daily sales</span>
            </div>
            <div className="h-20 bg-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg text-blue-600 mb-1">📈</div>
                <p className="text-xs text-gray-600">Line chart</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Top Selling Products */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Top-Selling Products</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Sort</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.unitsSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {product.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
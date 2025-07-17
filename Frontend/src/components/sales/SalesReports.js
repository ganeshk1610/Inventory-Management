import React, { useState } from "react";

const SalesReports = ({ salesData }) => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("30days");

  const reports = [
    {
      name: "Sales Summary Report",
      description: "Overview of total sales, trends, and performance metrics",
      type: "sales",
      lastGenerated: "2024-06-29"
    },
    {
      name: "Product Performance Report",
      description: "Detailed analysis of product sales and inventory",
      type: "products",
      lastGenerated: "2024-06-28"
    },
    {
      name: "Customer Analytics Report",
      description: "Customer behavior, retention, and lifetime value analysis",
      type: "customers",
      lastGenerated: "2024-06-27"
    },
    {
      name: "Financial Summary Report",
      description: "Revenue, expenses, and profit analysis",
      type: "financial",
      lastGenerated: "2024-06-26"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Generate and manage business reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate New Report
        </button>
      </div>

      {/* Report Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sales">Sales Reports</option>
            <option value="products">Product Reports</option>
            <option value="customers">Customer Reports</option>
            <option value="financial">Financial Reports</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {reports.map((report, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {report.type.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{report.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Last generated: {report.lastGenerated}
              </span>
              <div className="flex gap-2">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition-colors">
                  Generate
                </button>
                <button className="bg-gray-50 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl text-gray-400 mb-2">📊</div>
              <p className="text-gray-600">Select a report to preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;
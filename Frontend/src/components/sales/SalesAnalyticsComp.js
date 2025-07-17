import React from "react";

const SalesAnalyticsComp = ({ salesData }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="text-gray-600">Detailed analytics and performance insights</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl text-blue-600 mb-2">📈</div>
              <p className="text-gray-600">Line Chart - Sales over Time</p>
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl text-gray-400 mb-2">🥧</div>
              <p className="text-gray-600">Pie Chart - Category Breakdown</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Blue Crew Tee</span>
              <span className="font-semibold">$7,284</span>
            </div>
            <div className="flex justify-between">
              <span>Indigo Joggers</span>
              <span className="font-semibold">$11,560</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Month over Month</span>
              <span className="text-green-600 font-semibold">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Year over Year</span>
              <span className="text-green-600 font-semibold">+28.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Visit to Sale</span>
              <span className="font-semibold">3.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Lead to Customer</span>
              <span className="font-semibold">18.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsComp;
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../AuthContext";
import SalesOverview from "../components/sales/SalesOverview";
import SalesProducts from "../components/sales/SalesProducts";
import SalesBilling from "../components/sales/SalesBilling";
import SalesAnalyticsComp from "../components/sales/SalesAnalyticsComp";
import SalesCustomers from "../components/sales/SalesCustomers";
import SalesReports from "../components/sales/SalesReports";

const SalesAnalytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/sales/get/${authContext.user}`);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📋" },
  ];

  const toolsItems = [
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "support", label: "Support", icon: "❓" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SalesOverview salesData={salesData} />;
      case "products":
        return <SalesProducts salesData={salesData} />;
      case "billing":
        return <SalesBilling salesData={salesData} />;
      case "analytics":
        return <SalesAnalyticsComp salesData={salesData} />;
      case "customers":
        return <SalesCustomers salesData={salesData} />;
      case "reports":
        return <SalesReports salesData={salesData} />;
      default:
        return <SalesOverview salesData={salesData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-6">
          <div className="px-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Main
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-1 transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="px-4 mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tools
            </p>
            {toolsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-1 transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default SalesAnalytics;
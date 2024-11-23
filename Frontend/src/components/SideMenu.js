import React from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const isActive = (pathname) => location.pathname === pathname;

  return (
    <div className="h-full flex-col justify-between bg-white hidden lg:flex">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          <Link
            to="/Dashboard"
            className={`flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-gray-500 ${isActive('/Dashboard') ? 'font-bold' :''}`}
          >
            <img
              alt="dashboard-icon"
              src={require("../assets/dashboard-icon.png")}
            />
            <span className="text-sm font-medium"> Dashboard </span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Link to="/inventory">
                <div className="flex items-center gap-2">
                  <img
                    alt="inventory-icon"
                    src={require("../assets/inven.jpg")}
                  />
                  <span className={`text-sm font-medium ${isActive('/inventory') ? 'font-bold' : ''}`}> Inventory </span>
                </div>
              </Link>
            </summary>
          </details>

          <Link
            to="/purchase-details"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${isActive('/purchase-details') ? 'font-bold' : ''}`}
          >
            <img
              alt="purchase-icon"
              src={require("../assets/supplier-icon.png")}
            />
            <span className="text-sm font-medium"> Purchase Details</span>
          </Link>
          <Link
            to="/sales"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${isActive('/sales') ? 'font-bold' : ''}`}
          >
            <img alt="sale-icon" src={require("../assets/supplier-icon.png")} />
            <span className="text-sm font-medium"> Sales</span>
          </Link>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt="Profile"
            src={localStorageData.imageUrl}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium">
                {localStorageData.firstName + " " + localStorageData.lastName}
              </strong>
              <span> {localStorageData.email} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;

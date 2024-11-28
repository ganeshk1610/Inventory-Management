import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";
import Calculator from './Calculator'

function Layout() {
  const location = useLocation();

  // Check if the current route is `/pos`
  const hideHeaderAndSideMenu = location.pathname === "/pos";

  return (
    <div className="relative min-h-screen">
      {/* Render Calculator globally on all pages */}
      <Calculator />

      {/* Conditionally Render Header and SideMenu */}
      {/* Header */}
      {!hideHeaderAndSideMenu && (
        <div className="md:h-16">
          <Header />
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-12 bg-gray-100 items-baseline">
        {/* SideMenu */}
        {!hideHeaderAndSideMenu && (
          <div className="col-span-2 h-screen sticky top-0 hidden lg:flex">
            <SideMenu />
          </div>
        )}

        {/* Main Content */}
        <div className={hideHeaderAndSideMenu ? "col-span-12" : "col-span-10"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;

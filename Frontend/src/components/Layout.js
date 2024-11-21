import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  const location = useLocation();

  // Check if the current route is `/pos`
  const hideHeaderAndSideMenu = location.pathname === "/pos";

  return (
    <>
      {/* Render Header only if not on /pos */}
      {!hideHeaderAndSideMenu && (
        <div className="md:h-16">
          <Header />
        </div>
      )}

      <div className="grid grid-cols-12 bg-gray-100 items-baseline">
        {/* Render SideMenu only if not on /pos */}
        {!hideHeaderAndSideMenu && (
          <div className="col-span-2 h-screen sticky top-0 hidden lg:flex">
            <SideMenu />
          </div>
        )}
        {/* Main Content */}
        <div
          className={
            hideHeaderAndSideMenu ? "col-span-12" : "col-span-10"
          } /* Adjust grid span */
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;

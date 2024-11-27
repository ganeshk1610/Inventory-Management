import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
// import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import POS from "./pages/Pos"; // Correct path based on your structure

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const myLoginUser = JSON.parse(localStorage.getItem("user"));
    if (myLoginUser) {
      setUser(myLoginUser._id);
    } else {
      setUser("");
    }
    setLoader(false);
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify({ _id: newUser })); // Store user in localStorage
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect to login if accessing the root */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            {/* Nested routes within the protected layout */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-details" element={<PurchaseDetails />} />
            <Route path="sales" element={<Sales />} />
            {/* <Route path="manage-store" element={<Store />} /> */}
            <Route path="pos" element={<POS />} />
          </Route>

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;

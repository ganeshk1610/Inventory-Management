import React, { useState, useEffect } from "react";
import "./BillingSection.css";
import productData from "./alldata.json";
import searchicon from "./images/search.png";
import logo from "./images/black.png";

const BillingSection = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAllProducts(productData);
  }, []);

  const handleQtyChange = (id, newQty) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, qty: newQty } : product
      )
    );
  };

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const totalAmount = products.reduce(
    (acc, product) => acc + product.price * product.qty,
    0
  );
  const totalItems = products.length;

  const handleSearch = (e) => {
    e.preventDefault();
    const product = allProducts.find(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode === searchTerm
    );

    if (product) {
      const existingProduct = products.find((p) => p.name === product.name);
      if (existingProduct) {
        setProducts(
          products.map((p) =>
            p.name === product.name ? { ...p, qty: p.qty + 1 } : p
          )
        );
      } else {
        setProducts([
          ...products,
          { ...product, id: products.length + 1, qty: 1 },
        ]);
      }
    }

    setSearchTerm("");
  };

  const clearBill = () => {
    setProducts([]);
  };

  const handlePay = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/sales/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        clearBill(); // Clear the bill on successful payment
      } else {
        console.error("Payment error:", data.message);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const handlePrint = () => {
    const printContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src='${logo}' alt="InvenTrax" style="width: 250px;"/>
        <h1>Billing Details</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">#</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Qty</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (product, index) => `
            <tr key=${product.id}>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                index + 1
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                product.name
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                product.qty
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                product.price * product.qty
              }.00 ₹</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div style="text-align: right; margin-bottom: 20px;">
        <h2>Total Item(s): ${totalItems}</h2>
        <h2>Total Price: ${totalAmount}.00 ₹</h2>
      </div>
      <div style="text-align: center;">
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  `;

    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="billing-section">
      <div className="customer-selection">
        <form onSubmit={handleSearch} className="product-search">
          <input
            type="text"
            placeholder="Scan barcode or type the product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" type="submit">
            <img src={searchicon} alt="Search" />
          </button>
        </form>
      </div>

      <table className="billing-table">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: "left" }}>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td style={{ textAlign: "left" }}>{product.name}</td>
              <td>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleQtyChange(product.id, Math.max(1, product.qty - 1))
                    }
                    disabled={product.qty <= 1}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={product.qty}
                    onChange={(e) =>
                      handleQtyChange(
                        product.id,
                        Math.max(1, parseInt(e.target.value, 10) || 1)
                      )
                    }
                    min="1"
                    className="qty-input"
                  />
                  <button
                    onClick={() => handleQtyChange(product.id, product.qty + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{product.price}.00 ₹</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => removeProduct(product.id)}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="billing-summary">
        <div className="summary-item">Total Item(s): {totalItems}</div>
        <div className="summary-item">Price: {totalAmount}.00 ₹</div>
        <div className="summary-total">Gross Price: {totalAmount}.00 ₹</div>
      </div>

      <div className="billing-actions">
        <button className="action-btn print-btn" onClick={handlePrint}>
          🖨️ Print
        </button>
        <button className="action-btn cancel-btn" onClick={clearBill}>
          ✖ Clear All
        </button>
        <button className="action-btn pay-btn" onClick={handlePay}>
          💵 Pay
        </button>
      </div>
    </div>
  );
};

export default BillingSection;

import React, { useState } from "react";
import productsData from "./products.json"; // Import JSON file
import "./ProductsSection.css";

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories from products data
  const categories = [
    "All",
    ...new Set(productsData.map((product) => product.category)),
  ];

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? productsData
      : productsData.filter((product) => product.category === selectedCategory);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="products-section">
      <p>Products</p>

      <div className="filter-section">
        <label htmlFor="category-filter">Filter by Category: </label>
        <select
          id="category-filter"
          style={{ border: "none" }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Batch No</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.batchNo}</td>
              <td>{product.price}.00 ₹</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsSection;

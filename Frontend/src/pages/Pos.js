// src/App.js
import React, { useState } from 'react';
import Navbar from '../components/Header.js';
import BillingSection from '../components/BillingSection.jsx';
import ProductsSection from '../components/ProductsSection.jsx';
import './Pos.css';


const Pos = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Apple', price: 1.5, stock: 10, image: '/images/apple.jpg' },
    { id: 2, name: 'Banana', price: 0.5, stock: 15, image: '/images/banana.jpg' },
    { id: 3, name: 'Orange', price: 1.0, stock: 12, image: '/images/orange.jpg' },
  ]);

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Add product to cart and update stock
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Reduce stock in the products list
    setProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id ? { ...item, stock: item.stock - 1 } : item
      )
    );
  };

  // Calculate total cost
  const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle cancel action to clear the cart
  const handleCancel = () => {
    setCart([]); // Clear the cart
  };

  return (
    <div className="body">
      <Navbar  />
      <div className="content">
        <BillingSection cart={cart} total={total} onCancel={handleCancel} />
        <ProductsSection products={filteredProducts} addToCart={addToCart} />
      </div>
    </div>
  );
};

export default Pos;

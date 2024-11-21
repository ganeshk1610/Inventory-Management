import React from 'react';
import productsData from './products.json'; // Import JSON file
import './ProductsSection.css';

const ProductsSection = ({ addToCart }) => {
  return (
    <div className="products-section">
      <h2>Products</h2>
      <div className="product-grid">
        {productsData.map((product) => (
          <div key={product.id} className="product-card">
            <p style={{ paddingBottom: '10px' }}><b>{product.name}</b></p>
            <p>Quantity: {product.quantity}</p>
            <button 
              onClick={() => addToCart(product)} 
              disabled={product.quantity === 0}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;

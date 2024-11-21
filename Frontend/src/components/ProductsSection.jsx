// // src/ProductsSection.js
// import React from 'react';

// const ProductsSection = ({ products, addToCart }) => {
//   return (
//     <div className="products-section">
//       <h2>Products</h2>
//       <div className="product-grid">
//         {products.map((product) => (
//           <div key={product.id} className="product-card">
//             {/* <img src={product.image} alt={product.name} /> */}
//             <h3>{product.name}</h3>
//             <p>Price: ${product.price}</p>
//             <p>Stock: {product.stock}</p>
//             <button 
//               onClick={() => addToCart(product)} 
//               disabled={product.stock === 0}
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductsSection;

import React from 'react';
import productsData from './products.json'; // Import JSON file
import './ProductsSection.css';
const ProductsSection = () => {
  return (
    <div className="products-section">
      <h2 >Products</h2>
      <div className="product-grid">
        {productsData.map((product) => (
          <div key={product.id} className="product-card">
            {/* Display product details here */}
            <p style={{paddingBottom:'10px'}}><b>{product.name}</b></p>
            
            <p>Quantity: {product.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;

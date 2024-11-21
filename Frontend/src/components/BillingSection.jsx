import React, { useState, useEffect } from 'react';
import './BillingSection.css';
import productData from './alldata.json';

const BillingSection = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAllProducts(productData);
  }, []);

  const handleQtyChange = (id, newQty) => {
    setProducts(products.map(product =>
      product.id === id
        ? { ...product, qty: newQty }
        : product
    ));
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const totalAmount = products.reduce((acc, product) => acc + (product.price * product.qty), 0);
  const totalItems = products.reduce((acc, product) => acc + product.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    const product = allProducts.find(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode === searchTerm
    );

    if (product) {
      const existingProduct = products.find(p => p.name === product.name);
      if (existingProduct) {
        setProducts(products.map(p => 
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p
        ));
      } else {
        setProducts([...products, { ...product, id: products.length + 1, qty: 1 }]);
      }
    }

    setSearchTerm('');
  };

  const clearBill = () => {
    setProducts([]);
  };

  const handlePay = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        clearBill(); // Clear the bill on successful payment
      } else {
        console.error('Payment error:', data.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
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
          <button className="search-btn" type="submit">✔</button>
        </form>
      </div>

      <table className="billing-table">
        <thead>
          <tr>
            <th>#</th>
            <th style={{ textAlign: 'left' }}>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td style={{ textAlign: 'left' }}>{product.name}</td>
              <td>
                <button 
                  onClick={() => handleQtyChange(product.id, Math.max(1, product.qty - 1))} 
                  disabled={product.qty <= 1}
                  style={{ backgroundColor: '#6c757d', marginRight: '10px', padding: '5px 5.5px', borderRadius: '5px' }}
                >
                  -
                </button>
                <input 
                  type="number"
                  value={product.qty}
                  onChange={(e) => handleQtyChange(product.id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                  min="1"
                  style={{ width: '60px', textAlign: 'center', border:'none',height:'25px' }}
                />
                <button 
                  onClick={() => handleQtyChange(product.id, product.qty + 1)} 
                  style={{ backgroundColor: '#6c757d', marginLeft: '10px', padding: '4px', borderRadius: '5px' }}
                >
                  +
                </button>
              </td>
              <td>{product.price * product.qty}.00 ₹</td>
              <td>
                <button className="remove-btn" onClick={() => removeProduct(product.id)}>✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="billing-summary">
        <div className="summary-item">Total Item(s): {totalItems}</div>
        <div className="summary-item" style={{ display: 'flex' }}>
          Price: {totalAmount}.00 ₹
        </div>
        <div className="summary-total">Gross Price: {totalAmount}.00 ₹</div>
      </div>

      <div className="billing-actions">
        <button className="action-btn print-btn">🖨️ Print</button>
        <button className="action-btn cancel-btn" onClick={clearBill}>✖ Cancel</button>
        <button className="action-btn hold-btn">{'\u270B'} Hold</button>
        <button className="action-btn pay-btn" onClick={handlePay}>💵 Pay</button>
      </div>
    </div>
  );
};

export default BillingSection;




// import React, { useState, useEffect } from 'react';
// import './BillingSection.css';
// import productData from './alldata.json';

// const BillingSection = () => {
//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     setAllProducts(productData);
//   }, []);

//   const handleQtyChange = (id, increment) => {
//     setProducts(products.map(product =>
//       product.id === id
//         ? { ...product, qty: product.qty + increment }
//         : product
//     ));
//   };

//   const removeProduct = (id) => {
//     setProducts(products.filter(product => product.id !== id));
//   };

//   const totalAmount = products.reduce((acc, product) => acc + (product.price * product.qty), 0);
//   const totalItems = products.reduce((acc, product) => acc + product.qty, 0);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const product = allProducts.find(p => 
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode === searchTerm
//     );

//     if (product) {
//       const existingProduct = products.find(p => p.name === product.name);
//       if (existingProduct) {
//         setProducts(products.map(p => 
//           p.name === product.name ? { ...p, qty: p.qty + 1 } : p
//         ));
//       } else {
//         setProducts([...products, { ...product, id: products.length + 1, qty: 1 }]);
//       }
//     }

//     setSearchTerm('');
//   };

//   const clearBill = () => {
//     setProducts([]);
//   };

//   const handlePay = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/products/sell', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ products })
//       });

//       const data = await response.json();
//       if (response.ok) {
//         console.log(data.message);
//         clearBill(); // Clear the bill on successful payment
//       } else {
//         console.error('Payment error:', data.message);
//       }
//     } catch (error) {
//       console.error('Error during payment:', error);
//     }
//   };

//   return (
//     <div className="billing-section">
// <div className="customer-selection">
// <form onSubmit={handleSearch} className="product-search">
//   <input 
//     type="text" 
//     placeholder="Scan barcode or type the product name" 
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//   />
//   <button className="search-btn" type="submit">✔</button>
// </form>
// </div>

// <table className="billing-table">
// <thead>
//   <tr>
//     <th>#</th>
//     <th style={{ textAlign: 'left' }}>Item</th>
//     <th>Qty</th>
//     <th>Price</th>
//     <th>Action</th>
//   </tr>
// </thead>
// <tbody>
//   {products.map((product, index) => (
//     <tr key={product.id}>
//       <td>{index + 1}</td>
//       <td style={{ textAlign: 'left' }}>{product.name}</td>
//       <td>
//         <button 
//           onClick={() => handleQtyChange(product.id, -1)} 
//           disabled={product.qty <= 1}
//           style={{ backgroundColor: '#6c757d', marginRight: '10px', padding: '5px 5.5px', borderRadius: '5px' }}
//         >
//           -
//         </button>
//         {product.qty}
//         <button 
//           onClick={() => handleQtyChange(product.id, 1)} 
//           style={{ backgroundColor: '#6c757d', marginLeft: '10px', padding: '4px', borderRadius: '5px' }}
//         >
//           +
//         </button>
//       </td>
//       <td>{product.price * product.qty}.00 ₹</td>
//       <td>
//         <button className="remove-btn" onClick={() => removeProduct(product.id)}>✖</button>
//       </td>
//     </tr>
//   ))}
// </tbody>
// </table>

// <div className="billing-summary">
// <div className="summary-item">Total Item(s): {totalItems}</div>
// {/* <div className="summary-item">
//   Discount:
//   <input type="text" placeholder="Enter Discount" />
// </div> */}
// <div className="summary-item" style={{ display: 'flex' }}>
//   Price: {totalAmount}.00 ₹
// </div>
// <div className="summary-total">Gross Price: {totalAmount}.00 ₹</div>
// </div>
//       <div className="billing-actions">
//         <button className="action-btn print-btn">🖨️ Print</button>
//         <button className="action-btn cancel-btn" onClick={clearBill}>✖ Cancel</button>
//         <button className="action-btn hold-btn">{'\u270B'} Hold</button>
//         <button className="action-btn pay-btn" onClick={handlePay}>💵 Pay</button>
//       </div>
//     </div>
//   );
// };

// export default BillingSection;





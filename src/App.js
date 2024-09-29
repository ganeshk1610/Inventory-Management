import React, { useState, useEffect } from 'react';
import ProductList from './products';
import ProductTable from './status'; 
import logo1 from './images/inven2.jpg';
import logo from './images/inventory logo.png';
import search from './images/search.png';
import Papa from 'papaparse'; 
import './App.css';
// import { hover } from '@testing-library/user-event/dist/hover';

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', stock: 20, demand: 'High' },
    { id: 2, name: 'Product 2', stock: 10, demand: 'Medium' }
  ]);

  const [activeContent, setActiveContent] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);

  // Load CSV data
  useEffect(() => {
    Papa.parse('/product.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setProducts(results.data);
      },
    });
  }, []);

  // Function to handle product search
  const handleSearch = () => {
    const foundProduct = products.find(product => product.name.toLowerCase() === searchTerm.toLowerCase());
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setShowPopup(true);
      setErrorPopup(false);
    } else {
      setErrorPopup(true);
      setShowPopup(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setErrorPopup(false);
    setSelectedProduct(null);
    setSearchTerm('');
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'products':
        return <ProductList products={products} />;
      case 'status':
        return <ProductTable updateProducts={setProducts} />; // Pass the updater function
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <img src={logo1} alt='fd' style={{ height: '80px', marginLeft: '10px' }} />
          <img src={logo} alt="RAZZX" style={{ height: '50px', marginBottom: '15px' }} />
        </div>
        <div className="header-right">
          <input
            type="text"
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src={search} alt="search" style={{ height: '20px', cursor: 'pointer', }} onClick={handleSearch} />
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <ul>
            <li onClick={() => setActiveContent('products')}>Products</li>
            <li onClick={() => setActiveContent('status')}>Status</li>
            <li onClick={() => setActiveContent('report')}>Report</li>
            <li onClick={() => setActiveContent('New Arrivals')}>New Arrivals</li>
          </ul>
        </div>

        <div className="content">
          {renderContent()}
        </div>
      </div>

      {/* Popup for Product Details */}
      {showPopup && selectedProduct && (
         <div className="popup">
         <div className="popup-content">
           <span className="close" onClick={closePopup}>&times;</span>
           <h2>{selectedProduct.name}</h2>
           <p>Imported Date: {selectedProduct.importedDate}</p>
           <p>Quantity: {selectedProduct.quantity}</p>
           <p>Batch No: {selectedProduct.batchNo}</p>
           <p>Weekly Sales: {selectedProduct.weeklySales}</p>
         </div>
       </div>
      )}

      {/* Popup for Product Not Found */}
      {errorPopup && (
        <div className="popup">
          <div className="popup-content1">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>Product Not Found</h2>
            <p>No product matches your search. Please try again.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

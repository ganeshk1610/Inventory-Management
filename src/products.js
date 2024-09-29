import React, { useState } from 'react';
import Papa from 'papaparse';
import './products.css'; 
import logo from './images/favi.png';
// CSV File path
const csvFilePath = '/displayproduct.csv';

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    importedDate: '',
    quantity: '',
    batchNo: '',
    weeklySales: '',
  });

  // Load and parse CSV file on component mount
  React.useEffect(() => {
    Papa.parse(csvFilePath, {
      header: true, // Treat the first row as headers
      download: true,
      complete: (result) => {
        setProductList(result.data); // Set parsed CSV data to state
      },
    });
  }, []);

  const openPopup = (product) => {
    setActiveProduct(product);
    setIsPopupOpen(true);
    setIsAddingNewProduct(false); // Reset for new product form
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setActiveProduct(null);
    setNewProduct({ name: '', importedDate: '', quantity: '', batchNo: '', weeklySales: '' }); // Reset new product form
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add the new product to the product list (you might want to also update your CSV file accordingly)
    setProductList([...productList, newProduct]);
    closePopup(); // Close the popup after submission
  };

  return (
    <>
      {/* Product List as Tabs */}
      <div className={`tab-container ${isPopupOpen ? 'blur' : ''}`}>
        {productList.map((product, index) => (
          <div className="tab" key={index} onClick={() => openPopup(product)}>
            <h3>{product.name}</h3>
            {/* <p>Quantity: {product.quantity}</p> */}
          </div>
        ))}
        <div id="open-register" className="tab" onClick={() => { setIsPopupOpen(true); setIsAddingNewProduct(true); }}>
          <h3>+</h3>
          <p>Add New Product</p>
        </div>
      </div>

      {/* Product Details Popup */}
      {isPopupOpen && activeProduct && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2 style={{ paddingLeft: '5%' }}>{activeProduct.name}</h2>
            <p>Quantity: {activeProduct.quantity}</p>
            <p>Imported Date: {activeProduct.importedDate}</p>
            <p>Batch No.: {activeProduct.batchNo}</p>
            <p>Weekly Sales: {activeProduct.weeklySales}</p>

            {/* Arrow indicating profit or loss */}
            <p className="profit-loss-icon">
              {activeProduct.weeklySales > 0 ? (
                <span style={{ color: 'green' }}>↑ Profit</span>
              ) : (
                <span style={{ color: 'red' }}>↓ Loss</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* New Product Registration Form */}
      {isPopupOpen && isAddingNewProduct && (
        <div className="popup">
          <div className="popup-contentform">
          <span className="close" onClick={closePopup}>&times;</span>
      <img src={logo} alt="RAZZX" style={{ height: '50px', marginBottom: '30px' }} />

      <form onSubmit={handleFormSubmit} className="custom-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            placeholder="product category"
            required
          />
        </div>

        <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <div className="custom-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        quantity: Math.max(1, newProduct.quantity - 1),
                      })
                    }
                    className="decrement-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                      })
                    }
                    min="1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        quantity: newProduct.quantity + 1,
                      })
                    }
                    className="increment-btn"
                  >
                    +
                  </button>
                </div>
              </div>


        <div className="form-group">
          <label htmlFor="importedDate">Imported Date:</label>
          <input
            type="date"
            id="importedDate"
            value={newProduct.importedDate}
            onChange={(e) => setNewProduct({ ...newProduct, importedDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="batchNo">Batch No.:</label>
          <input
            type="text"
            id="batchNo"
            value={newProduct.batchNo}
            onChange={(e) => setNewProduct({ ...newProduct, batchNo: e.target.value })}
            placeholder="batch No."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            placeholder="Image URL"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Product</button>
      </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;

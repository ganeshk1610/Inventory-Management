import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; 
import './status.css'; 

const productCsv = '/product.csv';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    // Search the CSV file as plain text
    fetch(productCsv)
      .then(response => response.text()) // Read file as text
      .then(csvText => {
        const rows = csvText.split('\n'); // Split by new lines to get rows
        const csvHeaders = rows[0].split(','); // Extract headers (first row)
        setHeaders([...csvHeaders, 'Profit/Loss']); // Add 'Profit/Loss' as a new header

        // Map the remaining rows (excluding the first header row)
        const csvData = rows.slice(1).map(row => row.split(',')); // Split each row by comma
        setProducts(csvData); // Set parsed data in the state
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, []);

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            {/* Dynamically generate table headers */}
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Dynamically generate table rows */}
          {products.map((product, rowIndex) => (
            <tr key={rowIndex}>
              {product.map((cell, cellIndex) => (
                // Render each table cell normally, except the "Weekly Sales" column
                <td key={cellIndex}>{cell}</td>
              ))}
              {/* Add Profit/Loss arrow column */}
              <td className="profit-loss-icon">
                {parseInt(product[4]) > 0 ? ( // Assuming "Weekly Sales" is at index 4
                  <FaArrowUp style={{ color: 'green' }} />
                ) : (
                  <FaArrowDown style={{ color: 'red' }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

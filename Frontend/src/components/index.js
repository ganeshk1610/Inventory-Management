// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';  // Import the CSS file for styling
import App from './App';  // Import the App component

// Render the App component inside the root element
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Ensure this element exists in your HTML
);

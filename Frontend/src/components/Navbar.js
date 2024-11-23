import React from 'react';
// import logo1 from './images/inven2.jpg';
import logo from '../assets/logo.png';
import search from '../assets/search.png';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="InvenTrax" style={{ height: '50px', marginBottom: '15px' }} />
      </div>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search Products" 
          onChange={(e) => onSearch(e.target.value)}  
        />
        <img 
          src={search} 
          alt="Search" 
          className="search-icon"
        />
      </div>
    </nav>
  );
};

export default Navbar;

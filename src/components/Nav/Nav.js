import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="auth-icon">
        <Link to="/register">👤</Link>
      </div>
    </nav>
  );
};

export default Nav;

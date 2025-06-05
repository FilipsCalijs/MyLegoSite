import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "./Nav.css";
import logo from "../images/logoDesign.png";

const Nav = () => {
  const { username, logout, isAdmin } = useContext(UserContext);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const location = useLocation();

  // Для активного пункта
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="BrickMania Logo" height={40} style={{ verticalAlign: "middle" }} />
        </Link>
      </div>
      <ul className="nav-list">
        <li><Link to="/" className={isActive("/") ? "active-link" : ""}>Home</Link></li>
        <li><Link to="/categories" className={isActive("/categories") ? "active-link" : ""}>Categories</Link></li>
        <li><Link to="/blog" className={isActive("/blog") ? "active-link" : ""}>Blog</Link></li>
        <li><Link to="/contact" className={isActive("/contact") ? "active-link" : ""}>Contact</Link></li>
        {username && <li><Link to="/my-products" className={isActive("/my-products") ? "active-link" : ""}>My Products</Link></li>}
        {isAdmin && (
          <li
            className="nav-admin-menu"
            onMouseEnter={() => setShowAdminMenu(true)}
            onMouseLeave={() => setShowAdminMenu(false)}
            style={{ position: "relative" }}
          >
            <span style={{ cursor: "pointer", color: isActive("/manage-products") || isActive("/create-categories") ? "#1565c0" : "#fff" }}>
              Admin ▾
            </span>
            {showAdminMenu && (
              <ul className="admin-dropdown">
                <li>
                  <Link to="/manage-products" className={isActive("/manage-products") ? "active-link" : ""}>
                    Manage Products
                  </Link>
                </li>
                <li>
                  <Link to="/create-categories" className={isActive("/create-categories") ? "active-link" : ""}>
                    Create Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
      <div className="auth-links">
        {!username ? (
          <>
            <Link className="nav-auth-link" to="/login">Login</Link>
            <Link className="nav-auth-link" to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="username-text">{username}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;

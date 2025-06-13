import React, { useContext, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "./Nav.css";
import logo from "../images/logo.png";

const Nav = () => {
  const { username, logout, isAdmin } = useContext(UserContext);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showBlogMenu, setShowBlogMenu] = useState(false);
  const location = useLocation();
  const adminMenuRef = useRef(null);
  const blogMenuRef = useRef(null);

  // Закрыть меню при клике вне блока (универсальный подход)
  React.useEffect(() => {
    const closeMenus = (e) => {
      if (
        adminMenuRef.current && !adminMenuRef.current.contains(e.target)
      ) setShowAdminMenu(false);
      if (
        blogMenuRef.current && !blogMenuRef.current.contains(e.target)
      ) setShowBlogMenu(false);
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="BrickMania Logo" height={40} style={{ verticalAlign: "middle" }} />
        </Link>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/" className={isActive("/", true) ? "active-link" : ""}>Home</Link>
        </li>

        {/* BLOG DROPDOWN */}
        <li
          className="nav-blog-menu"
          ref={blogMenuRef}
          onMouseEnter={() => setShowBlogMenu(true)}
          onMouseLeave={() => setShowBlogMenu(false)}
        >
          <span
            tabIndex={0}
            className={isActive("/blog") ? "active-link" : ""}
            style={{ cursor: "pointer" }}
            onClick={() => setShowBlogMenu((v) => !v)}
            onFocus={() => setShowBlogMenu(true)}
            onBlur={() => setShowBlogMenu(false)}
          >
            Blog ▾
          </span>
          {showBlogMenu && (
            <ul className="blog-dropdown">
              <li>
                <Link to="/blog" className={isActive("/blog", true) ? "active-link" : ""}>
                  View Blogs
                </Link>
              </li>
              {username && (
                <li>
                  <Link to="/create-post" className={isActive("/create-post") ? "active-link" : ""}>
                    Create Blog
                  </Link>
                </li>
              )}
            </ul>
          )}
        </li>

        <li>
          <Link to="/contact" className={isActive("/contact") ? "active-link" : ""}>Contact</Link>
        </li>
        {username && <li><Link to="/my-products" className={isActive("/my-products") ? "active-link" : ""}>My Products</Link></li>}

        {/* ADMIN DROPDOWN (теперь открывается и по клику, и по hover) */}
        {isAdmin && (
          <li
            className="nav-admin-menu"
            ref={adminMenuRef}
            onMouseEnter={() => setShowAdminMenu(true)}
            onMouseLeave={() => setShowAdminMenu(false)}
          >
            <span
              tabIndex={0}
              style={{
                cursor: "pointer",
                color:
                  isActive("/manage-products") || isActive("/create-categories")
                    ? "#1565c0"
                    : "#fff",
              }}
              onClick={() => setShowAdminMenu((v) => !v)}
              onFocus={() => setShowAdminMenu(true)}
              onBlur={() => setShowAdminMenu(false)}
            >
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
             <li>
               <Link to="/manage-tags" className={isActive("/manage-tags") ? "active-link" : ""}>
                 Manage Tags
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

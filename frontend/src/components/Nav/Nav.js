import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import './Nav.css';

const Nav = () => {
  const { username, logout } = useContext(UserContext);

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {username && (
          <li><Link to="/my-products">My Products</Link></li>
        )}
      </ul>
      <div className="auth-icon">
        <Link to={username ? "#" : "/register"}>👤</Link>
        {username && (
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

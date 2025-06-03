import React, { useEffect, useState } from "react";
import axios from "axios";
import './IntroHero.css';
import { Link } from "react-router-dom";

const IntroHero = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Our Platform</h1>
        <p>Discover amazing LEGO categories</p>
      </div>

      <div className="category-grid">
        {categories.map(cat => (
          <Link to={`/category/${cat.id}`} key={cat.id} className="category-card-link">
            <div className="category-card">
              <img src={cat.image_url} alt={cat.name} onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"} />
              <h4>{cat.name}</h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default IntroHero;

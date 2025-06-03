import React, { useEffect, useState } from "react";
import axios from "axios";
import './IntroHero.css';

const IntroHero = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Platform</h1>
          <p>Discover amazing LEGO categories</p>
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Browse Categories</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <div className="category-card" key={cat.id}>
              <img src={cat.image_url} alt={cat.name} />
              <h4>{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default IntroHero;

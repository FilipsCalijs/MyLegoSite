import React, { useEffect, useState } from "react";
import axios from "axios";
import './HomeCategories.css';

function HomeCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Fetch categories error:", err));
  }, []);

  return (
    <div className="home-categories">
      {categories.map(cat => (
        <div key={cat.id} className="category-card">
          <img src={cat.image_url} alt={cat.name} />
          <h3>{cat.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default HomeCategories;

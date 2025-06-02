import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateCategories() {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("❌ Fetch categories error:", err));
  };

  const handleAddCategory = () => {
    if (!newCategory) return;
    axios.post("http://localhost:8081/add-category", { name: newCategory })
      .then(() => {
        fetchCategories();
        setNewCategory("");
      })
      .catch(err => console.error("❌ Add category error:", err));
  };

  return (
    <div>
      <h2>🛠️ Create Categories</h2>
      <input
        placeholder="New category"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
      />
      <button onClick={handleAddCategory}>Add</button>

      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CreateCategories;

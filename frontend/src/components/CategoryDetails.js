import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CategoryDetails() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  useEffect(() => {
    axios.get(`http://localhost:8081/subcategories-by-category/${id}`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error("Subcategory load error", err));
  }, [id]);

  const filtered = subcategories
    .filter(sub => sub.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "count") return b.count - a.count;
      return 0;
    });

  return (
    <div className="container mt-4">
      <h2>📁 Subcategories</h2>

      <input
        type="text"
        placeholder="Search subcategories..."
        className="form-control mb-2"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="mb-2">
        <label className="me-2">Sort by:</label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="form-select"
          style={{ width: "200px", display: "inline-block" }}
        >
          <option value="name">A-Z</option>
          <option value="count">By usage count</option>
        </select>
      </div>

      <ul className="list-group">
        {filtered.map(sub => (
          <li key={sub.id} className="list-group-item d-flex justify-content-between">
            {sub.name}
            <span className="badge bg-secondary">{sub.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryDetails;

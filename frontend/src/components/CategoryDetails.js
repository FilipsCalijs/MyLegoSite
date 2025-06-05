import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function CategoryDetails() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [sortOption, setSortOption] = useState("A-Z");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8081/subcategories-by-category/${id}`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error("Failed to load subcategories", err));
  }, [id]);

  const sortedAndFiltered = subcategories
    .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "Z-A") return b.name.localeCompare(a.name);
      if (sortOption === "Most items") return b.count - a.count;
      if (sortOption === "Least items") return a.count - b.count;
      return 0;
    });

  return (
    <div className="container mt-4">
      <h2>📁 Subcategories</h2>

      <input
        type="text"
        placeholder="Search subcategories..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="mb-3">
        <label>Sort by: </label>
        <select
          className="form-select"
          style={{ width: "200px", display: "inline-block", marginLeft: "10px" }}
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Most items">Most items</option>
          <option value="Least items">Least items</option>
        </select>
      </div>

      <ul className="list-group">
        {sortedAndFiltered.map(sub => (
          <li key={sub.id} className="list-group-item">
            <Link to={`/subcategory/${sub.id}`}>
              {sub.name} ({sub.count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryDetails;

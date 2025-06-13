import React, { useEffect, useState } from "react";
import axios from "axios";

function CreateCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = () => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data));
  };

  const fetchSubcategories = () => {
    axios.get("http://localhost:8081/subcategories")
      .then(res => setSubcategories(res.data));
  };

  const handleAddCategory = () => {
    if (!newCategory) return;
    axios.post("http://localhost:8081/add-category", {
      name: newCategory,
      image_url: newImageUrl
    }).then(() => {
      setNewCategory("");
      setNewImageUrl("");
      fetchCategories();
    });
  };

  const handleDeleteCategory = (id) => {
    axios.delete(`http://localhost:8081/delete-category/${id}`)
      .then(() => fetchCategories());
  };

  const handleEditCategory = (id, name, image_url) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
    setEditImageUrl(image_url || "");
  };

  const handleSaveEditedCategory = () => {
    axios.put(`http://localhost:8081/edit-category/${editCategoryId}`, {
      name: editCategoryName,
      image_url: editImageUrl
    }).then(() => {
      setEditCategoryId(null);
      setEditCategoryName("");
      setEditImageUrl("");
      fetchCategories();
    });
  };

  const handleAddSubcategory = () => {
    if (!selectedCategoryId || !newSubcategory) return;
    axios.post("http://localhost:8081/add-subcategory", {
      name: newSubcategory,
      category_id: selectedCategoryId
    }).then(() => {
      setNewSubcategory("");
      fetchSubcategories();
    });
  };

  const handleDeleteSubcategory = (id) => {
    axios.delete(`http://localhost:8081/delete-subcategory/${id}`)
      .then(() => fetchSubcategories());
  };

  const handleEditSubcategory = (id, name) => {
    setEditSubcategoryId(id);
    setEditSubcategoryName(name);
  };

  const handleSaveEditedSubcategory = () => {
    axios.put(`http://localhost:8081/edit-subcategory/${editSubcategoryId}`, {
      name: editSubcategoryName
    }).then(() => {
      setEditSubcategoryId(null);
      setEditSubcategoryName("");
      fetchSubcategories();
    });
  };

  const truncate = (text, max = 15) => {
    if (window.innerWidth < 700 && text.length > max) {
      return text.slice(0, max) + "...";
    }
    return text;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📂 Manage Categories</h2>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="New Category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Image URL"
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleAddCategory}>Add Category</button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              {editCategoryId === cat.id ? (
                <>
                  <td>
                    <input
                      className="form-control"
                      value={editCategoryName}
                      onChange={e => setEditCategoryName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="form-control"
                      value={editImageUrl}
                      onChange={e => setEditImageUrl(e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success me-2" onClick={handleSaveEditedCategory}>💾</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{cat.name}</td>
                  <td className="image-url-cell">
                    <small title={cat.image_url}>{truncate(cat.image_url)}</small>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditCategory(cat.id, cat.name, cat.image_url)}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCategory(cat.id)}>❌</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-4">📁 Subcategories</h3>
      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <select
            className="form-select"
            value={selectedCategoryId}
            onChange={e => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="New Subcategory"
            value={newSubcategory}
            onChange={e => setNewSubcategory(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleAddSubcategory}>Add Subcategory</button>
        </div>
      </div>

      <ul className="list-group">
        {subcategories.map(sub => (
          <li key={sub.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editSubcategoryId === sub.id ? (
              <>
                <input
                  className="form-control me-2"
                  value={editSubcategoryName}
                  onChange={e => setEditSubcategoryName(e.target.value)}
                />
                <button className="btn btn-success me-2" onClick={handleSaveEditedSubcategory}>💾</button>
              </>
            ) : (
              <>
                <span>{sub.name} <small className="text-muted">(from {categories.find(c => c.id === sub.category_id)?.name || "?"})</small></span>
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditSubcategory(sub.id, sub.name)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSubcategory(sub.id)}>❌</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateCategories;

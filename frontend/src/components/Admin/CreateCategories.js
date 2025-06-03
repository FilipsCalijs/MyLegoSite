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

  return (
    <div>
      <h2>📂 Manage Categories</h2>
      <input
        placeholder="New Category"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
      />
      <input
        placeholder="Image URL"
        value={newImageUrl}
        onChange={e => setNewImageUrl(e.target.value)}
      />
      <button onClick={handleAddCategory}>Add</button>

      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {editCategoryId === cat.id ? (
              <>
                <input
                  value={editCategoryName}
                  onChange={e => setEditCategoryName(e.target.value)}
                />
                <input
                  value={editImageUrl}
                  placeholder="Image URL"
                  onChange={e => setEditImageUrl(e.target.value)}
                />
                <button onClick={handleSaveEditedCategory}>💾</button>
              </>
            ) : (
              <>
                {cat.name}
                <button onClick={() => handleEditCategory(cat.id, cat.name, cat.image_url)}>✏️</button>
                <button onClick={() => handleDeleteCategory(cat.id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>📁 Subcategories</h3>
      <select
        value={selectedCategoryId}
        onChange={e => setSelectedCategoryId(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <input
        placeholder="New Subcategory"
        value={newSubcategory}
        onChange={e => setNewSubcategory(e.target.value)}
      />
      <button onClick={handleAddSubcategory}>Add Subcategory</button>

      <ul>
        {subcategories.map(sub => (
          <li key={sub.id}>
            {editSubcategoryId === sub.id ? (
              <>
                <input
                  value={editSubcategoryName}
                  onChange={e => setEditSubcategoryName(e.target.value)}
                />
                <button onClick={handleSaveEditedSubcategory}>💾</button>
              </>
            ) : (
              <>
                {sub.name} (from {categories.find(c => c.id === sub.category_id)?.name || "?"})
                <button onClick={() => handleEditSubcategory(sub.id, sub.name)}>✏️</button>
                <button onClick={() => handleDeleteSubcategory(sub.id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateCategories;

import React, { useState, useEffect } from "react";
import axios from "axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchAllProducts();
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data));
    axios.get("http://localhost:8081/subcategories")
      .then(res => setSubcategories(res.data));
  }, []);

  const fetchAllProducts = () => {
    axios.get("http://localhost:8081/all-products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("❌ Fetch error:", err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/delete-product/${id}`)
      .then(() => fetchAllProducts())
      .catch(err => console.error("❌ Delete error:", err));
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    axios.put(`http://localhost:8081/update-product/${id}`, editedProduct)
      .then(() => {
        setEditingId(null);
        setEditedProduct({});
        fetchAllProducts();
      })
      .catch(err => console.error("❌ Update error:", err));
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct({});
  };

  const getCategoryIdByName = (name) => {
    const found = categories.find(c => c.name === name);
    return found ? found.id : null;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h2>🛠️ Manage All Products</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Figure Name</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Category</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Subcategory</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>My Price (€)</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Quantity</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Image</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {editingId === p.id ? (
                <>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <input name="name" value={editedProduct.name} onChange={handleInputChange} />
                  </td>

                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <select
                      name="category"
                      value={editedProduct.category}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </td>

                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <select
                      name="subcategory"
                      value={editedProduct.subcategory}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {subcategories
                        .filter(sub => sub.category_id === getCategoryIdByName(editedProduct.category))
                        .map(sub => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                    </select>
                  </td>

                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <input name="my_price" type="number" value={editedProduct.my_price} onChange={handleInputChange} />
                  </td>

                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <input name="quantity" type="number" value={editedProduct.quantity} onChange={handleInputChange} />
                  </td>

                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <input name="image_url" value={editedProduct.image_url} onChange={handleInputChange} />
                  </td>

                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <button onClick={() => handleSave(p.id)}>💾</button>{" "}
                    <button onClick={handleCancel}>↩️</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.name}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.category}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.subcategory}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.my_price}€</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>{p.quantity}</td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <img
                      src={p.image_url || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"}
                      alt="figure"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <button onClick={() => handleEditClick(p)}>✏️</button>{" "}
                    <button onClick={() => handleDelete(p.id)}>❌</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProducts;

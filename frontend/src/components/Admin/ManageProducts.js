import React, { useState, useEffect } from "react";
import axios from "axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    fetchAllProducts();
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

  return (
    <div>
      <h2>🛠️ Manage All Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {editingId === p.id ? (
              <>
                <input name="category" value={editedProduct.category} onChange={handleInputChange} placeholder="Category" />
                <input name="my_price" value={editedProduct.my_price} onChange={handleInputChange} placeholder="My Price" />
                <input name="quantity" value={editedProduct.quantity} onChange={handleInputChange} placeholder="Quantity" />
                <input name="market_price" value={editedProduct.market_price} onChange={handleInputChange} placeholder="Market Price" />
                <button onClick={() => handleSave(p.id)}>💾</button>
                <button onClick={handleCancel}>↩️</button>
              </>
            ) : (
              <>
                {p.category} — {p.my_price}€ ({p.quantity}) | {p.market_price}€
                <button onClick={() => handleEditClick(p)}>✏️</button>
                <button onClick={() => handleDelete(p.id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageProducts;

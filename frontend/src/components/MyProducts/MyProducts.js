import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";

function MyProducts() {
  const { userId } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    my_price: "",
    quantity: "",
    market_price: ""
  });
  const [editId, setEditId] = useState(null);

  // Загрузка продуктов, категорий и подкатегорий
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = () => {
    axios.get(`http://localhost:8081/my-products/${userId}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error loading products", err));
  };

  const fetchCategories = () => {
    axios.get("http://localhost:8081/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error loading categories", err));
  };

  const fetchSubcategories = () => {
    axios.get("http://localhost:8081/subcategories")
      .then(res => setSubcategories(res.data))
      .catch(err => console.error("Error loading subcategories", err));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:8081/update-product/${editId}`
      : "http://localhost:8081/add-product";

    const method = editId ? axios.put : axios.post;

    method(url, { ...formData, user_id: userId })
      .then(() => {
        fetchProducts();
        setFormData({
          category: "",
          subcategory: "",
          my_price: "",
          quantity: "",
          market_price: ""
        });
        setEditId(null);
      })
      .catch(err => console.error("Submit error", err));
  };

  const handleEdit = (product) => {
    setFormData({
      category: product.category,
      subcategory: product.subcategory,
      my_price: product.my_price,
      quantity: product.quantity,
      market_price: product.market_price
    });
    setEditId(product.id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/delete-product/${id}`)
      .then(() => fetchProducts())
      .catch(err => console.error("Delete error", err));
  };

  return (
    <div className="container mt-4">
      <h2>My Products</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row mb-2">
          <div className="col">
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              name="subcategory"
              className="form-control"
              value={formData.subcategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col">
            <input
              type="number"
              name="my_price"
              className="form-control"
              placeholder="My Price"
              value={formData.my_price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="quantity"
              className="form-control"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="market_price"
              className="form-control"
              placeholder="Market Price"
              value={formData.market_price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category</th>
            <th>Subcategory</th>
            <th>My Price</th>
            <th>Quantity</th>
            <th>Market Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.category}</td>
              <td>{p.subcategory}</td>
              <td>{p.my_price}</td>
              <td>{p.quantity}</td>
              <td>{p.market_price}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyProducts;

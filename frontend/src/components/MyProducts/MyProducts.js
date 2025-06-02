import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';

function MyProducts() {
  const { userId } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    category: '',
    my_price: '',
    quantity: '',
    market_price: ''
  });
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (!userId) return;
    fetchProducts();
    fetchCategories();
  }, [userId]);

  const fetchProducts = () => {
    axios.get(`http://localhost:8081/my-products/${userId}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const fetchCategories = () => {
    axios.get(`http://localhost:8081/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Category fetch error:", err));
  };

  const handleAddOrEdit = () => {
    const endpoint = editId
      ? `http://localhost:8081/update-product/${editId}`
      : 'http://localhost:8081/add-product';
    const method = editId ? 'put' : 'post';
    axios[method](endpoint, {
      user_id: userId,
      ...newProduct
    }).then(() => {
      fetchProducts();
      setNewProduct({ category: '', my_price: '', quantity: '', market_price: '' });
      setEditId(null);
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/delete-product/${id}`)
      .then(() => fetchProducts());
  };

  const handleEdit = (product) => {
    setNewProduct({
      category: product.category,
      my_price: product.my_price,
      quantity: product.quantity,
      market_price: product.market_price
    });
    setEditId(product.id);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...products].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setProducts(sorted);
  };

  return (
    <div>
      <h2>🧱 My Products</h2>

      <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <input placeholder="My Price" value={newProduct.my_price} onChange={e => setNewProduct({ ...newProduct, my_price: e.target.value })} />
      <input placeholder="Quantity" value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} />
      <input placeholder="Market Price" value={newProduct.market_price} onChange={e => setNewProduct({ ...newProduct, market_price: e.target.value })} />
      <button onClick={handleAddOrEdit}>{editId ? 'Update' : 'Add'} Product</button>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('category')}>Category</th>
            <th onClick={() => handleSort('my_price')}>My Price</th>
            <th onClick={() => handleSort('quantity')}>Quantity</th>
            <th onClick={() => handleSort('market_price')}>Market Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.category}</td>
              <td>{p.my_price}€</td>
              <td>{p.quantity}</td>
              <td>{p.market_price}€</td>
              <td>
                <button onClick={() => handleEdit(p)}>✏️</button>
                <button onClick={() => handleDelete(p.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyProducts;

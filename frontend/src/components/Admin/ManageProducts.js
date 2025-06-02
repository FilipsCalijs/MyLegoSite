import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageProducts() {
  const [productsByUser, setProductsByUser] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8081/all-products-with-users')
      .then(res => {
        const grouped = {};
        res.data.forEach(product => {
          const username = product.username || 'Unknown';
          if (!grouped[username]) grouped[username] = [];
          grouped[username].push(product);
        });
        setProductsByUser(grouped);
      })
      .catch(err => console.error("❌ Fetch error:", err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/delete-product/${id}`)
      .then(() => {
        setProductsByUser(prev => {
          const updated = { ...prev };
          for (let user in updated) {
            updated[user] = updated[user].filter(p => p.id !== id);
          }
          return updated;
        });
      });
  };

  return (
    <div>
      <h2>🛠 Manage All Products</h2>
      {Object.keys(productsByUser).map(username => (
        <div key={username}>
          <h4>{username}</h4>
          <ul>
            {productsByUser[username].map(p => (
              <li key={p.id}>
                {p.category} — {p.my_price}€ ({p.quantity}) | {p.market_price}€
                <button onClick={() => handleDelete(p.id)}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ManageProducts;

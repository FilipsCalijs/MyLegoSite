import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SubcategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");

  // Стейт для модалки + выбранный продавец
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  useEffect(() => {
    handleSorting();
  }, [products, sortBy]);

  const fetchProducts = async () => {
  try {
    const res = await axios.get(`http://localhost:8081/products-by-subcategory/${id}`);
    setProducts(res.data);
    console.log("products:", res.data); // <-- это скриншот или текстом сюда
  } catch (err) {
    console.error("Failed to load products", err);
  }
};

  const handleSorting = () => {
    let sorted = [...products];
    if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "price") sorted.sort((a, b) => a.my_price - b.my_price);
    else sorted.sort((a, b) => a.id - b.id);
    setFiltered(sorted);
  };

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h2>Subcategory:</h2>
      <div className="d-flex align-items-center mb-3 gap-3">
        <div>
          Items per page:{" "}
          <select value={itemsPerPage} onChange={e => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}>
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          Sort by:{" "}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="id">ID</option>
            <option value="name">Figure Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Figure Name</th>
            <th>Price (€)</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                <img
                  src={p.image_url || "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                  alt={p.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
              </td>
              <td>{p.name}</td>
              <td>{p.my_price} €</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => { setSelectedProduct(p); setShowModal(true); }}
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="btn btn-outline-primary"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="btn btn-outline-primary"
        >
          Next
        </button>
      </div>

      {/* Модальное окно для связи с продавцом */}
      {showModal && selectedProduct && (
  <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
    <div className="custom-modal-window" onClick={e => e.stopPropagation()}>
      <div className="custom-modal-header">
        <span>Information</span>
        <button className="custom-modal-close" onClick={() => setShowModal(false)}>×</button>
      </div>
      <div className="custom-modal-body">
        <strong>Свяжитесь с продавцом</strong>
        <div>
  <b>Ник:</b> {selectedProduct.seller_name || "не найден"} <br />
  <b>Email:</b> {selectedProduct.seller_email || "не найден"}
</div>

        <div>Выберите товар и напишите продавцу через форму обратной связи.</div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SubcategoryProducts;

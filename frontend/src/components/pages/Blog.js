import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


function Blog() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8081/posts")
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  // Фильтрация по заголовку
  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>📝 Blog — Latest Released from Other People</h2>
      <input
        className="form-control mb-3"
        placeholder="Search by title…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 300 }}
      />

      {filtered.length === 0 && <div>No posts yet.</div>}

      <div className="row">
        {filtered.map(post => (
          <div className="col-md-6 mb-4" key={post.id}>
            <div className="card h-100">
              <div className="card-body">
                <h4>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </h4>
                <div>
                  <span style={{ fontSize: "0.9em", color: "#777" }}>
                    {post.author_name}
                    {post.is_admin && <span style={{ color: "#f90", marginLeft: 8 }}>(admin)</span>} · {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2" style={{ minHeight: 40 }}>
                

                </div>
                <div className="mt-3" style={{ minHeight: 64 }}>
                  {/* Обрезаем текст без html тегов */}
                  {post.body.replace(/<[^>]+>/g, '').slice(0, 160)}...
                </div>
                <div className="mt-2">
                  <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;

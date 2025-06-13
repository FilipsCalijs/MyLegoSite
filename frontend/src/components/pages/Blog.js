import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8081/posts")
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8081/tags")
      .then(res => setAllTags(res.data))
      .catch(() => setAllTags([]));
  }, []);

  // Фильтрация по заголовку и тегу
  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTag === "" || (post.tags || "").includes(selectedTag))
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

      <div className="mb-3" style={{ maxWidth: 300 }}>
        <select
          className="form-select"
          value={selectedTag}
          onChange={e => setSelectedTag(e.target.value)}
        >
          <option value="">Filter by tag</option>
          {allTags.map(tag => (
            <option key={tag.id} value={tag.name}>{tag.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && <div>No posts yet.</div>}

      <div className="row">
  {filtered.map(post => {
    const tags = typeof post.tags === "string"
      ? post.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      : [];

    return (
      <div className="col-md-6 mb-4" key={post.id}>
        <div className="card h-100">
          <div className="card-body">
            <h4>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h4>
            <div>
              <span style={{ fontSize: "0.9em", color: "#777" }}>
                {post.author_name}
                {post.is_admin && (
                  <span style={{ color: "#f90", marginLeft: 8 }}>(admin)</span>
                )} · {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Теги */}
            <div className="mt-2 mb-2">
              {tags.length > 0 ? (
                tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-secondary me-1">{tag}</span>
                ))
              ) : (
                <span className="text-muted small">No tags</span>
              )}
            </div>

            <div className="mt-3" style={{ minHeight: 64 }}>
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
    );
  })}
</div>

    </div>
  );
}

export default Blog;

import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import CommentSection from "./CommentSection";

function PostView() {
  const { id } = useParams();
  const { userId, isAdmin } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8081/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm("Delete this post?")) return;
    axios.delete(`http://localhost:8081/posts/${id}`, { withCredentials: true })
      .then(() => navigate("/blog"));
  };

  if (loading) return <div>Loading…</div>;
  if (!post) return <div>Post not found.</div>;

  // Преобразуем tags в массив всегда
  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
      ? post.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      : [];

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <div>
        <span style={{ color: "#777" }}>
          {post.author_name}
          {post.is_admin && <span style={{ color: "#f90", marginLeft: 8 }}>(admin)</span>}
          {" · "}
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Теги */}
      <div className="mb-3">
        <strong>Tags:</strong>
        {tags.length === 0
          ? <span> No tags</span>
          : tags.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary me-1 tag">{tag}</span>
            ))
        }
      </div>

      <div className="mb-4" dangerouslySetInnerHTML={{ __html: post.body }} />

      {(userId === post.user_id || isAdmin) && (
        <div className="mb-4">
          <Link className="btn btn-warning me-2" to={`/edit-post/${post.id}`}>Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      )}

      <h4>Comments</h4>
      <CommentSection postId={post.id} />
    </div>
  );
}

export default PostView;

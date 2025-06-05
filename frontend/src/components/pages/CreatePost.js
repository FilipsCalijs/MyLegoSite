import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  const { userId } = useContext(UserContext);
  const { id } = useParams(); // id поста для редактирования, если есть
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    axios.get("http://localhost:8081/tags")
      .then(res => setAllTags(res.data))
      .catch(() => setAllTags([]));

    if (id) {
      setLoading(true);
      axios.get(`http://localhost:8081/posts/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setTags(res.data.tags || []);
          setBody(res.data.body || "");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || tags.length === 0 || !body) {
      alert("Fill in all fields and select at least one tag.");
      return;
    }

    const postData = {
        title,
        tags: tags.join(','), // строки, а не массив!
        body,
        user_id: userId
      };
      const req = id
        ? axios.put(`http://localhost:8081/posts/${id}`, postData, { withCredentials: true })
        : axios.post("http://localhost:8081/posts", postData, { withCredentials: true });
      

    req.then(res => navigate(`/post/${res.data.id || id}`));
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="container mt-4">
      <h2>{id ? "Edit Post" : "Create Post"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Tags</label>
          <select
            className="form-control"
            value={tags}
            onChange={e => setTags(Array.from(e.target.selectedOptions, o => o.value))}
            multiple
            required
            style={{ minHeight: 80 }}
          >
            {allTags.map(tag => (
              <option key={tag.id} value={tag.name}>{tag.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Content</label>
          <ReactQuill theme="snow" value={body} onChange={setBody} />
        </div>
        <button className="btn btn-success" type="submit">
          {id ? "Save Changes" : "Publish"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;

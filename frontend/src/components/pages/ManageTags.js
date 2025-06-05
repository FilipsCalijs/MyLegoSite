import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";

function ManageTags() {
  const { isAdmin } = useContext(UserContext);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = () => {
    axios.get("http://localhost:8081/tags", { withCredentials: true })
      .then(res => setTags(res.data))
      .catch(() => setTags([]));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    axios.post("http://localhost:8081/tags", { name: newTag }, { withCredentials: true })
      .then(() => {
        setNewTag("");
        fetchTags();
      });
  };

  const startEdit = (id, name) => {
    setEditId(id);
    setEditName(name);
  };

  const saveEdit = () => {
    axios.put(`http://localhost:8081/tags/${editId}`, { name: editName }, { withCredentials: true })
      .then(() => {
        setEditId(null);
        setEditName("");
        fetchTags();
      });
  };

  const deleteTag = id => {
    if (!window.confirm("Delete this tag?")) return;
    axios.delete(`http://localhost:8081/tags/${id}`, { withCredentials: true })
      .then(fetchTags);
  };

  if (!isAdmin) return <div>Not allowed</div>;

  return (
    <div className="container mt-4">
      <h2>Manage Tags</h2>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="New tag"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          style={{ maxWidth: 300, display: "inline-block" }}
        />
        <button className="btn btn-success ms-2" onClick={addTag}>Add Tag</button>
      </div>
      <ul className="list-group" style={{ maxWidth: 350 }}>
        {tags.map(tag =>
          <li key={tag.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editId === tag.id ? (
              <>
                <input
                  className="form-control"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ width: 120, display: "inline-block" }}
                />
                <button className="btn btn-sm btn-success ms-2" onClick={saveEdit}>💾</button>
                <button className="btn btn-sm btn-secondary ms-2" onClick={() => setEditId(null)}>✖</button>
              </>
            ) : (
              <>
                <span>{tag.name}</span>
                <span>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(tag.id, tag.name)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteTag(tag.id)}>❌</button>
                </span>
              </>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}

export default ManageTags;

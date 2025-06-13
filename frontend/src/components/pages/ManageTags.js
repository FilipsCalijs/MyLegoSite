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

  const saveEdit = async () => {
    const oldTag = tags.find(t => t.id === editId)?.name;
    const newTag = editName.trim();
  
    if (!oldTag || !newTag || oldTag === newTag) return;
  
    try {
      // 1. Обновить тег в таблице `tags`
      await axios.put(`http://localhost:8081/tags/${editId}`, { name: newTag }, { withCredentials: true });
  
      // 2. Получить все посты
      const res = await axios.get("http://localhost:8081/posts");
      const posts = res.data;
  
      // 3. Фильтруем посты, в которых есть oldTag
      const postsToUpdate = posts.filter(post =>
        typeof post.tags === "string" && post.tags.split(",").map(t => t.trim()).includes(oldTag)
      );
  
      // 4. Обновляем каждый такой пост
      for (const post of postsToUpdate) {
        const updatedTags = post.tags
          .split(",")
          .map(t => t.trim() === oldTag ? newTag : t.trim())
          .filter(Boolean)
          .join(",");
  
        await axios.put(`http://localhost:8081/posts/${post.id}`, {
          title: post.title,
          tags: updatedTags,
          body: post.body,
          user_id: post.user_id // обязательно, иначе backend отклонит
        }, { withCredentials: true });
      }
  
      // 5. Сброс формы
      setEditId(null);
      setEditName("");
      fetchTags();
  
    } catch (err) {
      console.error("❌ Ошибка при обновлении тега или постов", err);
      alert("Failed to update tag or related posts.");
    }
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

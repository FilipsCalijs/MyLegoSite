import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";

function CommentSection({ postId }) {
  const { username, userId, isAdmin } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = () => {
    axios
      .get(`http://localhost:8081/comments/${postId}`)
      .then((res) => setComments(res.data));
  };

  const handleAdd = () => {
    if (!text.trim()) return;
    axios
      .post(
        "http://localhost:8081/comments",
        { post_id: postId, user_id: userId, text },
        { withCredentials: true }
      )
      .then(() => {
        setText("");
        fetchComments();
      });
  };

  const startEdit = (id, txt) => {
    setEditingId(id);
    setEditText(txt);
  };

  const saveEdit = () => {
    console.log({ text: editText, user_id: userId, is_admin: isAdmin }); // проверяй тут!
    axios.put(`http://localhost:8081/comments/${editingId}`, {
        text: editText,
        user_id: userId,
        is_admin: isAdmin
      })      
      .then(() => {
        setEditingId(null);
        setEditText("");
        fetchComments();
      });
  };
  

  const handleDelete = (id) => {
    if (!window.confirm("Delete this comment?")) return;
    axios
      .delete(`http://localhost:8081/comments/${id}`, { withCredentials: true })
      .then(fetchComments);
  };

  return (
    <div className="mt-4">

      {username && (
        <div className="mb-2">
          <textarea
            className="form-control"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
          />
          <button className="btn btn-primary mt-1" onClick={handleAdd}>
            Post
          </button>
        </div>
      )}
      <ul className="list-group">
        {comments.map((c) => (
          <li key={c.id} className="list-group-item d-flex flex-column">
            <div>
              <strong>
                {c.author_name}{" "}
                {c.is_admin ? (
                  <span className="badge bg-warning">admin</span>
                ) : (
                  ""
                )}
              </strong>
              {" "}
              <span style={{ fontSize: 12, color: "#888" }}>
                {c.created_at && c.created_at.split("T")[0]}
              </span>
            </div>
            {editingId === c.id ? (
              <div>
                <textarea
                  value={editText}
                  className="form-control"
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                />
                <button
                  className="btn btn-success btn-sm mt-1"
                  onClick={saveEdit}
                >
                  💾
                </button>
                <button
                  className="btn btn-secondary btn-sm mt-1 ms-2"
                  onClick={() => setEditingId(null)}
                >
                  ✖
                </button>
              </div>
            ) : (
              <div>
                <div>{c.text}</div>
                {(String(userId) === String(c.user_id) || isAdmin) && (

                  <span>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => startEdit(c.id, c.text)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      ❌
                    </button>
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {comments.length === 0 && (
        <div className="text-muted mt-2">No comments yet.</div>
      )}
    </div>
  );
}

export default CommentSection;

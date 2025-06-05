const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get comments for a post
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const [rows] = await db.query(`
    SELECT comments.*, login.username, login.is_admin 
    FROM comments 
    JOIN login ON comments.user_id = login.id 
    WHERE post_id = ? 
    ORDER BY created_at DESC
  `, [postId]);
  res.json(rows);
});

// Create comment
router.post('/', authenticate, async (req, res) => {
  const { post_id, text } = req.body;
  try {
    await db.query(
      'INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)',
      [post_id, req.user.id, text]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Delete comment
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
    const comment = rows[0];
    if (!comment) return res.sendStatus(404);
    if (comment.user_id !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

    await db.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;

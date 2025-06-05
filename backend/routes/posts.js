const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to check authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT posts.*, login.username, login.is_admin 
      FROM posts 
      JOIN login ON posts.user_id = login.id
      ORDER BY posts.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create post
router.post('/', authenticate, async (req, res) => {
  const { title, tags, body } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO posts (title, tags, body, user_id) VALUES (?, ?, ?, ?)',
      [title, tags, body, req.user.id]
    );
    res.json({ success: true, postId: result.insertId });
  } catch {
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Edit post
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, tags, body } = req.body;
  try {
    // Check ownership or admin
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    const post = rows[0];
    if (!post) return res.sendStatus(404);
    if (post.user_id !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

    await db.query('UPDATE posts SET title = ?, tags = ?, body = ? WHERE id = ?', [
      title,
      tags,
      body,
      id,
    ]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    const post = rows[0];
    if (!post) return res.sendStatus(404);
    if (post.user_id !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;

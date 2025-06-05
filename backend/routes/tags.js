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

// Only admin check
const requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin) return res.sendStatus(403);
  next();
};

// Get all tags
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM tags');
  res.json(rows);
});

// Create new tag (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO tags (name) VALUES (?)', [name]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Insert failed' });
  }
});

// Edit tag (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.query('UPDATE tags SET name = ? WHERE id = ?', [name, id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete tag (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tags WHERE id = ?', [id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;

const express = require('express');
const db = require('../models/postgres');
const authenticateToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// Create post - Admin only
router.post('/', authenticateToken, allowRoles('admin'), async (req, res) => {
  const { title, content, category } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO posts (user_id, title, content, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, title, content, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating post');
  }
});

// Get all posts - Public (or use authenticateToken for private feed)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT posts.*, users.name AS author
       FROM posts JOIN users ON posts.user_id = users.id
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching posts');
  }
});

// Update post - Admin only
router.put('/:id', authenticateToken, allowRoles('admin'), async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const result = await db.query(
      `UPDATE posts SET title = $1, content = $2, category = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [title, content, category, id]
    );
    if (result.rowCount === 0) return res.status(404).send('Post not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
  }
});

// Delete post - Admin only
router.delete('/:id', authenticateToken, allowRoles('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).send('Post not found');
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting post');
  }
});

module.exports = router;

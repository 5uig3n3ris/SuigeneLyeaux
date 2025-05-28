const db = require('../models/postgres');

// Add a bookmark
const addBookmark = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const existing = await db.query(
      'SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Post already bookmarked' });
    }

    await db.query(
      'INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)',
      [userId, postId]
    );
    res.status(201).json({ message: 'Post bookmarked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to bookmark post' });
  }
};

// Get all bookmarks for the user
const getBookmarks = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookmarks = await db.query(
      `SELECT posts.* FROM bookmarks 
       JOIN posts ON bookmarks.post_id = posts.id
       WHERE bookmarks.user_id = $1`,
      [userId]
    );
    res.json(bookmarks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve bookmarks' });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
};

module.exports = {
  addBookmark,
  getBookmarks,
  removeBookmark,
};

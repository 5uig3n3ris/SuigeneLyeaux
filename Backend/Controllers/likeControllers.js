const db = require('../models/postgres');

// Like a post
const likePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const existing = await db.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    await db.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
      [userId, postId]
    );

    res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to like post' });
  }
};

// Get number of likes for a post
const getPostLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      'SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1',
      [postId]
    );
    res.json({ postId, likes: parseInt(result.rows[0].like_count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve likes' });
  }
};

// Remove like
const unlikePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Like not found' });
    }

    res.json({ message: 'Like removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove like' });
  }
};

module.exports = {
  likePost,
  getPostLikes,
  unlikePost,
};

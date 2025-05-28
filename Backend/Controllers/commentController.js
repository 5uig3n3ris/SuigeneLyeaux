const db = require('../models/postgres');

// Create a comment
const createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [postId, userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Get all comments for a post
const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      `SELECT comments.*, users.name AS commenter_name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE post_id = $1
       ORDER BY comments.created_at ASC`,
      [postId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Delete a comment (admin or owner)
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;

  try {
    const result = await db.query(`SELECT * FROM comments WHERE id = $1`, [commentId]);
    const comment = result.rows[0];

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (user.role !== 'admin' && comment.user_id !== user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await db.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  createComment,
  getCommentsByPostId,
  deleteComment,
};

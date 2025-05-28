const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByPostId,
  deleteComment,
} = require('../Controllers/commentController');
const authenticate = require('../Middleware/authMiddleware');

// Create a comment on a post
router.post('/:postId', authenticate, createComment);

// Get all comments for a specific post
router.get('/:postId', getCommentsByPostId);

// Delete a comment
router.delete('/delete/:commentId', authenticate, deleteComment);

module.exports = router;

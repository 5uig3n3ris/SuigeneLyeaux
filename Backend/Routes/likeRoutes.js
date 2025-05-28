const express = require('express');
const router = express.Router();
const {
  likePost,
  getPostLikes,
  unlikePost,
} = require('../Controllers/likeController');
const authenticate = require('../Middleware/authMiddleware');

// Like a post
router.post('/:postId', authenticate, likePost);

// Get likes for a post
router.get('/:postId', getPostLikes);

// Remove like
router.delete('/:postId', authenticate, unlikePost);

module.exports = router;

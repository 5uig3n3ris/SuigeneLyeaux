const express = require('express');
const router = express.Router();
const {
  addBookmark,
  getBookmarks,
  removeBookmark,
} = require('../controllers/bookmarkController');
const authenticate = require('../middleware/authMiddleware');

// Add bookmark
router.post('/:postId', authenticate, addBookmark);

// Get all bookmarks
router.get('/', authenticate, getBookmarks);

// Remove bookmark
router.delete('/:postId', authenticate, removeBookmark);

module.exports = router;

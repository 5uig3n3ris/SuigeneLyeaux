const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getAllTags,
  addCategory,
  addTag,
  getPostsByCategory,
  getPostsByTag,
} = require('../Controllers/tagCategoryController');

const authenticate = require('../Middleware/authMiddleware');
const authorize = require('../Middleware/roleMiddleware'); // Ensure this checks for 'admin'

// View
router.get('/categories', getAllCategories);
router.get('/tags', getAllTags);
router.get('/category/:categoryId/posts', getPostsByCategory);
router.get('/tag/:tagId/posts', getPostsByTag);

// Admin-only
router.post('/category', authenticate, authorize('admin'), addCategory);
router.post('/tag', authenticate, authorize('admin'), addTag);

module.exports = router;

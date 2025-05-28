const db = require('../Models/postgres');

// Fetch all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Fetch all tags
const getAllTags = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tags');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// Add category (admin only)
const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query('INSERT INTO categories(name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: 'Category exists or invalid' });
  }
};

// Add tag (admin only)
const addTag = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query('INSERT INTO tags(name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: 'Tag exists or invalid' });
  }
};

// Filter posts by category
const getPostsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await db.query(`
      SELECT posts.* FROM posts
      JOIN post_categories ON posts.id = post_categories.post_id
      WHERE post_categories.category_id = $1
    `, [categoryId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Filter posts by tag
const getPostsByTag = async (req, res) => {
  const { tagId } = req.params;
  try {
    const result = await db.query(`
      SELECT posts.* FROM posts
      JOIN post_tags ON posts.id = post_tags.post_id
      WHERE post_tags.tag_id = $1
    `, [tagId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

module.exports = {
  getAllCategories,
  getAllTags,
  addCategory,
  addTag,
  getPostsByCategory,
  getPostsByTag,
};

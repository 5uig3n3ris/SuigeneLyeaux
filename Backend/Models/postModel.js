const db = require('./postgres');

const createPost = async ({ title, content, userId, categoryId }) => {
  const result = await db.query(
    `INSERT INTO posts (title, content, user_id, category_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, userId, categoryId]
  );
  return result.rows[0];
};

const getAllPosts = async () => {
  const result = await db.query(
    `SELECT posts.*, users.name as author, categories.name as category
     FROM posts
     JOIN users ON posts.user_id = users.id
     LEFT JOIN categories ON posts.category_id = categories.id
     ORDER BY created_at DESC`
  );
  return result.rows;
};

module.exports = { createPost, getAllPosts };

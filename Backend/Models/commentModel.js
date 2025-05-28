const db = require('./postgres');

const addComment = async ({ postId, userId, content }) => {
  const result = await db.query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [postId, userId, content]
  );
  return result.rows[0];
};

const getCommentsByPost = async (postId) => {
  const result = await db.query(
    `SELECT comments.*, users.name AS author
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE post_id = $1
     ORDER BY created_at ASC`,
    [postId]
  );
  return result.rows;
};

module.exports = { addComment, getCommentsByPost };

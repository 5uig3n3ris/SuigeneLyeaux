const db = require('./postgres');

const getAllTags = async () => {
  const result = await db.query(`SELECT * FROM tags`);
  return result.rows;
};

const assignTagsToPost = async (postId, tagIds) => {
  const queries = tagIds.map(tagId => {
    return db.query(
      `INSERT INTO post_tags (post_id, tag_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [postId, tagId]
    );
  });
  await Promise.all(queries);
};

module.exports = { getAllTags, assignTagsToPost };

const db = require('./postgres');

const getAllCategories = async () => {
  const result = await db.query(`SELECT * FROM categories`);
  return result.rows;
};

module.exports = { getAllCategories };

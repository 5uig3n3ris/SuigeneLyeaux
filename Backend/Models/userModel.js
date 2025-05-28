const db = require('./postgres');

const createUser = async ({ name, email, password, roleId }) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password, role_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, password, roleId]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT users.*, roles.name AS role FROM users
     JOIN roles ON users.role_id = roles.id
     WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail
};

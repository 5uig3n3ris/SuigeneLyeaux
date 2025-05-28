// /models/db.js or /config/db.js (recommended)
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  // Optional: enable SSL for production (e.g., with Railway or Supabase)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // export pool too, in case you need advanced features elsewhere
};

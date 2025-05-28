const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/postgres'); // your wrapper
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register (Signup)
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      `INSERT INTO users (name, email, password, role_id)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email`,
      [name, email, hashedPassword, roleResult.rows[0].id]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      `SELECT users.*, roles.name AS role FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Dummy user (for now, no DB)
const DUMMY_USER = {
  username: 'admin',
  password: 'admin123',
};

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h',
    });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;

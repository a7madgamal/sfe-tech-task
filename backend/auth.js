const express = require('express');
const router = express.Router();
const { users, tokens } = require('./db');

const generateToken = username => `${username}-${Date.now()}`;

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.username);
  tokens[token] = user.id;

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

module.exports = router;

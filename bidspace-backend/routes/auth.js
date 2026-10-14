const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (db.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = db.createUser({ name: name.trim(), email, password: hash, login_method: 'email' });
    const safe = db.safeUser(user);
    res.status(201).json({ message: 'Account created', token: signToken(safe), user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = db.findUserByEmail(email);
    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const safe = db.safeUser(user);
    res.json({ message: 'Login successful', token: signToken(safe), user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/** Demo Google login — for production verify Google ID token */
router.post('/google', (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email required from Google' });
    }
    let user = db.findUserByEmail(email);
    if (!user) {
      user = db.createUser({ name, email, password: null, login_method: 'google', avatar });
    }
    const safe = db.safeUser(user);
    if (avatar && !safe.avatar) {
      db.updateUser(user.id, { avatar });
      safe.avatar = avatar;
    }
    res.json({ message: 'Google login successful', token: signToken(safe), user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Google login failed' });
  }
});

router.get('/me', authRequired, (req, res) => {
  const user = db.safeUser(db.findUserById(req.user.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.put('/me', authRequired, (req, res) => {
  try {
    const { name, bio, phone, avatar } = req.body;
    const user = db.updateUser(req.user.id, { name, bio, phone, avatar });
    res.json({ message: 'Profile updated', user: db.safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query } = require('../db/database');
const { setAuthCookie, clearAuthCookie, requireAuth } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Register new account
router.post('/register', authLimiter, validate(registerSchema), (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = query.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `usr-${crypto.randomUUID()}`;

    const defaultPreferences = JSON.stringify({
      theme: 'light',
      fontSize: 16,
      fontFamily: 'sans',
      reduceMotion: false,
      easyRead: false
    });

    query.run(
      'INSERT INTO users (id, name, email, password_hash, role, preferences_json) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), normalizedEmail, passwordHash, 'user', defaultPreferences]
    );

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      role: 'user',
      preferences: JSON.parse(defaultPreferences)
    };

    setAuthCookie(res, newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Login
router.post('/login', authLimiter, validate(loginSchema), (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = query.get('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email address or password'
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email address or password'
      });
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: JSON.parse(user.preferences_json || '{}')
    };

    setAuthCookie(res, userProfile);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: userProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Current User Session
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;

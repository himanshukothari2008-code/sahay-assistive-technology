const express = require('express');
const crypto = require('crypto');
const { query } = require('../db/database');
const { validate, feedbackSchema } = require('../middleware/validate');

const router = express.Router();

router.post('/', validate(feedbackSchema), (req, res) => {
  try {
    const { message, rating } = req.body;
    const feedbackId = `fb-${crypto.randomUUID()}`;
    const userId = req.user ? req.user.id : null;

    query.run(`
      INSERT INTO feedback (id, user_id, message, rating)
      VALUES (?, ?, ?, ?)
    `, [feedbackId, userId, message, rating || 5]);

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! It helps improve AccessiAid.'
    });
  } catch (error) {
    console.error('Feedback submit error:', error);
    res.status(500).json({ success: false, error: 'Failed to record feedback' });
  }
});

module.exports = router;

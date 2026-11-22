const express = require('express');
const crypto = require('crypto');
const { query } = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { validate, preferencesSchema, aacItemSchema, emergencyCardSchema } = require('../middleware/validate');

const router = express.Router();

// All routes under /me require authentication
router.use(requireAuth);

// 1. User Preferences
router.get('/preferences', (req, res) => {
  res.json({
    success: true,
    data: req.user.preferences
  });
});

router.put('/preferences', validate(preferencesSchema), (req, res) => {
  try {
    const updatedPreferences = {
      ...req.user.preferences,
      ...req.body
    };

    query.run('UPDATE users SET preferences_json = ? WHERE id = ?', [
      JSON.stringify(updatedPreferences),
      req.user.id
    ]);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedPreferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ success: false, error: 'Failed to update preferences' });
  }
});

// 2. Bookmarks
router.get('/bookmarks', (req, res) => {
  try {
    const bookmarks = query.all(`
      SELECT b.id, b.category_id, b.content_block_id, b.created_at,
             c.title as category_title, c.slug as category_slug,
             cb.title as block_title, cb.type as block_type, cb.body_markdown
      FROM bookmarks b
      JOIN categories c ON b.category_id = c.id
      JOIN content_blocks cb ON b.content_block_id = cb.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookmarks' });
  }
});

router.post('/bookmarks', (req, res) => {
  try {
    const { category_id, content_block_id } = req.body;
    if (!category_id || !content_block_id) {
      return res.status(400).json({ success: false, error: 'category_id and content_block_id are required' });
    }

    const bookmarkId = `bmk-${crypto.randomUUID()}`;
    query.run(`
      INSERT INTO bookmarks (id, user_id, category_id, content_block_id)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, content_block_id) DO NOTHING
    `, [bookmarkId, req.user.id, category_id, content_block_id]);

    res.status(201).json({ success: true, message: 'Bookmark saved' });
  } catch (error) {
    console.error('Save bookmark error:', error);
    res.status(500).json({ success: false, error: 'Failed to save bookmark' });
  }
});

router.delete('/bookmarks/:id', (req, res) => {
  try {
    const { id } = req.params;
    query.run('DELETE FROM bookmarks WHERE (id = ? OR content_block_id = ?) AND user_id = ?', [
      id, id, req.user.id
    ]);
    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove bookmark' });
  }
});

// 3. Learning Progress
router.get('/progress', (req, res) => {
  try {
    const progress = query.all(`
      SELECT p.category_id, p.sections_completed_json, p.updated_at,
             c.title as category_title, c.slug as category_slug
      FROM progress p
      JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ?
    `, [req.user.id]).map(p => ({
      ...p,
      sections_completed: JSON.parse(p.sections_completed_json || '[]')
    }));

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Fetch progress error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

router.put('/progress', (req, res) => {
  try {
    const { category_id, sections_completed } = req.body;
    if (!category_id || !Array.isArray(sections_completed)) {
      return res.status(400).json({ success: false, error: 'category_id and sections_completed array required' });
    }

    const progressId = `prg-${crypto.randomUUID()}`;
    query.run(`
      INSERT INTO progress (id, user_id, category_id, sections_completed_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, category_id) DO UPDATE SET
        sections_completed_json = excluded.sections_completed_json,
        updated_at = CURRENT_TIMESTAMP
    `, [progressId, req.user.id, category_id, JSON.stringify(sections_completed)]);

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: 'Failed to update progress' });
  }
});

// 4. Quiz History
router.get('/quiz-history', (req, res) => {
  try {
    const history = query.all(`
      SELECT qa.id, qa.score, qa.total, qa.created_at,
             c.title as category_title, c.slug as category_slug
      FROM quiz_attempts qa
      JOIN categories c ON qa.category_id = c.id
      WHERE qa.user_id = ?
      ORDER BY qa.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('Fetch quiz history error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quiz history' });
  }
});

// 5. AAC Custom Picture Symbols
router.get('/aac', (req, res) => {
  try {
    // Return both default symbols (user_id IS NULL) and user's custom symbols
    const items = query.all(`
      SELECT * FROM aac_items
      WHERE user_id IS NULL OR user_id = ?
      ORDER BY display_order ASC, label ASC
    `, [req.user.id]);

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Fetch AAC items error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch AAC symbols' });
  }
});

router.post('/aac', validate(aacItemSchema), (req, res) => {
  try {
    const { label, symbol_icon, audio_phrase, category_group, display_order } = req.body;
    const aacId = `aac-${crypto.randomUUID()}`;

    query.run(`
      INSERT INTO aac_items (id, user_id, label, symbol_icon, audio_phrase, category_group, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [aacId, req.user.id, label, symbol_icon, audio_phrase, category_group, display_order || 0]);

    res.status(201).json({
      success: true,
      message: 'Custom AAC card added',
      data: { id: aacId, label, symbol_icon, audio_phrase, category_group }
    });
  } catch (error) {
    console.error('Add AAC item error:', error);
    res.status(500).json({ success: false, error: 'Failed to add custom AAC card' });
  }
});

router.delete('/aac/:id', (req, res) => {
  try {
    const { id } = req.params;
    query.run('DELETE FROM aac_items WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Custom AAC card removed' });
  } catch (error) {
    console.error('Delete AAC error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove custom AAC card' });
  }
});

// 6. Emergency Medical Card
router.get('/emergency-card', (req, res) => {
  try {
    const card = query.get('SELECT * FROM emergency_cards WHERE user_id = ?', [req.user.id]);
    res.json({
      success: true,
      data: card ? JSON.parse(card.data_json) : null
    });
  } catch (error) {
    console.error('Fetch emergency card error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch emergency card' });
  }
});

router.put('/emergency-card', validate(emergencyCardSchema), (req, res) => {
  try {
    const dataString = typeof req.body.data_json === 'string' 
      ? req.body.data_json 
      : JSON.stringify(req.body.data_json);

    const cardId = `emc-${crypto.randomUUID()}`;
    query.run(`
      INSERT INTO emergency_cards (id, user_id, data_json, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        data_json = excluded.data_json,
        updated_at = CURRENT_TIMESTAMP
    `, [cardId, req.user.id, dataString]);

    res.json({ success: true, message: 'Emergency card saved successfully' });
  } catch (error) {
    console.error('Save emergency card error:', error);
    res.status(500).json({ success: false, error: 'Failed to save emergency card' });
  }
});

module.exports = router;

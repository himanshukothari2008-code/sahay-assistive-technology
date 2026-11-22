const express = require('express');
const crypto = require('crypto');
const { query } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const {
  validate,
  categorySchema,
  contentBlockSchema,
  mediaSchema,
  quizQuestionSchema
} = require('../middleware/validate');

const router = express.Router();

// All routes here strictly require admin role
router.use(requireAdmin);

// 1. System Statistics
router.get('/stats', (req, res) => {
  try {
    const totalUsers = query.get('SELECT COUNT(*) as count FROM users')?.count || 0;
    const totalCategories = query.get('SELECT COUNT(*) as count FROM categories')?.count || 0;
    const totalBlocks = query.get('SELECT COUNT(*) as count FROM content_blocks')?.count || 0;
    const totalMedia = query.get('SELECT COUNT(*) as count FROM media')?.count || 0;
    const totalQuizzes = query.get('SELECT COUNT(*) as count FROM quiz_questions')?.count || 0;
    const totalAttempts = query.get('SELECT COUNT(*) as count FROM quiz_attempts')?.count || 0;
    const avgScore = query.get('SELECT AVG(CAST(score AS FLOAT) / total * 100) as avg FROM quiz_attempts')?.avg || 0;
    const totalFeedback = query.get('SELECT COUNT(*) as count FROM feedback')?.count || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCategories,
        totalBlocks,
        totalMedia,
        totalQuizzes,
        totalAttempts,
        averageQuizScore: Math.round(avgScore),
        totalFeedback
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin stats' });
  }
});

// 2. Feedback Inbox
router.get('/feedback', (req, res) => {
  try {
    const feedbackList = query.all(`
      SELECT f.id, f.message, f.rating, f.created_at,
             u.name as user_name, u.email as user_email
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `);

    res.json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

// 3. Category Management (CRUD)
router.post('/categories', validate(categorySchema), (req, res) => {
  try {
    const { slug, title, icon, summary, color, display_order } = req.body;
    const catId = `cat-${crypto.randomUUID()}`;

    query.run(`
      INSERT INTO categories (id, slug, title, icon, summary, color, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `, [catId, slug, title, icon, summary, color, display_order || 0]);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { id: catId, slug, title }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});

router.put('/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, icon, color, display_order, is_active } = req.body;

    query.run(`
      UPDATE categories SET
        title = COALESCE(?, title),
        summary = COALESCE(?, summary),
        icon = COALESCE(?, icon),
        color = COALESCE(?, color),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `, [title, summary, icon, color, display_order, is_active, id]);

    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    query.run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete category' });
  }
});

// 4. Content Blocks Management (CRUD)
router.post('/content', validate(contentBlockSchema), (req, res) => {
  try {
    const { category_id, type, title, body_markdown, easy_read_body, language, display_order, sources_json } = req.body;
    const blockId = `cb-${crypto.randomUUID()}`;
    const sourcesStr = typeof sources_json === 'string' ? sources_json : JSON.stringify(sources_json || []);

    query.run(`
      INSERT INTO content_blocks (id, category_id, type, title, body_markdown, easy_read_body, language, display_order, sources_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [blockId, category_id, type, title, body_markdown, easy_read_body || null, language || 'en', display_order || 0, sourcesStr]);

    res.status(201).json({
      success: true,
      message: 'Content block created',
      data: { id: blockId, title, type }
    });
  } catch (error) {
    console.error('Create content block error:', error);
    res.status(500).json({ success: false, error: 'Failed to create content block' });
  }
});

router.put('/content/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, body_markdown, easy_read_body, type, display_order, sources_json } = req.body;
    const sourcesStr = sources_json !== undefined 
      ? (typeof sources_json === 'string' ? sources_json : JSON.stringify(sources_json)) 
      : null;

    query.run(`
      UPDATE content_blocks SET
        title = COALESCE(?, title),
        body_markdown = COALESCE(?, body_markdown),
        easy_read_body = COALESCE(?, easy_read_body),
        type = COALESCE(?, type),
        display_order = COALESCE(?, display_order),
        sources_json = COALESCE(?, sources_json)
      WHERE id = ?
    `, [title, body_markdown, easy_read_body, type, display_order, sourcesStr, id]);

    res.json({ success: true, message: 'Content block updated' });
  } catch (error) {
    console.error('Update content block error:', error);
    res.status(500).json({ success: false, error: 'Failed to update content block' });
  }
});

router.delete('/content/:id', (req, res) => {
  try {
    const { id } = req.params;
    query.run('DELETE FROM content_blocks WHERE id = ?', [id]);
    res.json({ success: true, message: 'Content block deleted' });
  } catch (error) {
    console.error('Delete content block error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete content block' });
  }
});

// 5. Media Management (CRUD)
router.post('/media', validate(mediaSchema), (req, res) => {
  try {
    const { category_id, type, url, title, alt_text, caption, transcript, source_credit } = req.body;
    const mediaId = `med-${crypto.randomUUID()}`;

    query.run(`
      INSERT INTO media (id, category_id, type, url, title, alt_text, caption, transcript, source_credit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [mediaId, category_id, type, url, title, alt_text, caption || null, transcript || null, source_credit || null]);

    res.status(201).json({
      success: true,
      message: 'Media item added',
      data: { id: mediaId, title, url }
    });
  } catch (error) {
    console.error('Create media error:', error);
    res.status(500).json({ success: false, error: 'Failed to add media item' });
  }
});

router.delete('/media/:id', (req, res) => {
  try {
    const { id } = req.params;
    query.run('DELETE FROM media WHERE id = ?', [id]);
    res.json({ success: true, message: 'Media item deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete media item' });
  }
});

// 6. Quiz Management (CRUD)
router.post('/quiz', validate(quizQuestionSchema), (req, res) => {
  try {
    const { category_id, question, options, correct_index, explanation } = req.body;
    const quizId = `qz-${crypto.randomUUID()}`;

    query.run(`
      INSERT INTO quiz_questions (id, category_id, question, options_json, correct_index, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [quizId, category_id, question, JSON.stringify(options), correct_index, explanation]);

    res.status(201).json({
      success: true,
      message: 'Quiz question created',
      data: { id: quizId, question }
    });
  } catch (error) {
    console.error('Create quiz question error:', error);
    res.status(500).json({ success: false, error: 'Failed to create quiz question' });
  }
});

router.delete('/quiz/:id', (req, res) => {
  try {
    const { id } = req.params;
    query.run('DELETE FROM quiz_questions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Quiz question deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete quiz question' });
  }
});

module.exports = router;

const express = require('express');
const { query } = require('../db/database');

const router = express.Router();

// List all active categories
router.get('/', (req, res) => {
  try {
    const categories = query.all(`
      SELECT c.*,
        (SELECT COUNT(*) FROM content_blocks WHERE category_id = c.id) as content_blocks_count,
        (SELECT COUNT(*) FROM quiz_questions WHERE category_id = c.id) as quiz_count,
        (SELECT COUNT(*) FROM media WHERE category_id = c.id) as media_count
      FROM categories c
      WHERE c.is_active = 1
      ORDER BY c.display_order ASC
    `);

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve categories' });
  }
});

// Get category detail by slug
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const category = query.get('SELECT * FROM categories WHERE slug = ? AND is_active = 1', [slug]);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const blocks = query.all(
      'SELECT id, category_id, type, title, body_markdown, easy_read_body, language, display_order, sources_json FROM content_blocks WHERE category_id = ? ORDER BY display_order ASC',
      [category.id]
    ).map((b) => ({
      ...b,
      sources: JSON.parse(b.sources_json || '[]')
    }));

    const media = query.all(
      'SELECT id, category_id, type, url, title, alt_text, caption, transcript, source_credit FROM media WHERE category_id = ?',
      [category.id]
    );

    const quizRaw = query.all(
      'SELECT id, category_id, question, options_json, explanation FROM quiz_questions WHERE category_id = ?',
      [category.id]
    );

    const quiz = quizRaw.map((q) => ({
      id: q.id,
      category_id: q.category_id,
      question: q.question,
      options: JSON.parse(q.options_json),
      explanation: q.explanation
    }));

    res.json({
      success: true,
      data: {
        ...category,
        blocks,
        media,
        quiz
      }
    });
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve category details' });
  }
});

// Get quiz questions specifically
router.get('/:slug/quiz', (req, res) => {
  try {
    const { slug } = req.params;
    const category = query.get('SELECT id, title FROM categories WHERE slug = ?', [slug]);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const questions = query.all(
      'SELECT id, category_id, question, options_json FROM quiz_questions WHERE category_id = ?',
      [category.id]
    ).map((q) => ({
      id: q.id,
      category_id: q.category_id,
      question: q.question,
      options: JSON.parse(q.options_json)
    }));

    res.json({
      success: true,
      category: category.title,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve quiz questions' });
  }
});

module.exports = router;

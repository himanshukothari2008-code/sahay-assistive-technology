const express = require('express');
const { query } = require('../db/database');

const router = express.Router();

// Search across categories, content blocks, solutions and tools
router.get('/', (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q || q.length < 2) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const searchTerm = `%${q}%`;

    // 1. Search Categories
    const matchingCategories = query.all(`
      SELECT id, slug, title, summary, icon, 'category' as result_type
      FROM categories
      WHERE title LIKE ? OR summary LIKE ?
    `, [searchTerm, searchTerm]);

    // 2. Search Content Blocks (Solutions, Tools, Overviews, Challenges)
    const matchingBlocks = query.all(`
      SELECT cb.id, cb.category_id, cb.type, cb.title, cb.body_markdown,
             c.title as category_title, c.slug as category_slug, 'content' as result_type
      FROM content_blocks cb
      JOIN categories c ON cb.category_id = c.id
      WHERE cb.title LIKE ? OR cb.body_markdown LIKE ?
      LIMIT 20
    `, [searchTerm, searchTerm]);

    const results = [
      ...matchingCategories.map(c => ({
        id: c.id,
        type: 'category',
        title: c.title,
        snippet: c.summary,
        url: `/category/${c.slug}`
      })),
      ...matchingBlocks.map(b => ({
        id: b.id,
        type: b.type,
        title: `${b.category_title}: ${b.title}`,
        snippet: b.body_markdown.replace(/[#*`_]/g, '').slice(0, 150) + '...',
        url: `/category/${b.category_slug}#${b.type}`
      }))
    ];

    res.json({
      success: true,
      query: q,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

module.exports = router;

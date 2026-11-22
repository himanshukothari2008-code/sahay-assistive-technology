const express = require('express');
const crypto = require('crypto');
const { query } = require('../db/database');
const { validate, quizSubmitSchema } = require('../middleware/validate');

const router = express.Router();

// Submit quiz answers and calculate results
router.post('/:categoryId/submit', validate(quizSubmitSchema), (req, res) => {
  try {
    const { categoryId } = req.params;
    const { answers } = req.body;

    const category = query.get('SELECT id, title FROM categories WHERE id = ? OR slug = ?', [categoryId, categoryId]);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Get all questions for this category
    const questions = query.all('SELECT * FROM quiz_questions WHERE category_id = ?', [category.id]);
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let score = 0;
    const results = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.question_id);
      if (q) {
        const isCorrect = ans.selected_index === q.correct_index;
        if (isCorrect) score++;

        results.push({
          question_id: q.id,
          question: q.question,
          options: JSON.parse(q.options_json),
          selected_index: ans.selected_index,
          correct_index: q.correct_index,
          is_correct: isCorrect,
          explanation: q.explanation
        });
      }
    }

    const total = answers.length;
    const percentage = Math.round((score / total) * 100);

    // Save attempt if user is authenticated
    if (req.user) {
      const attemptId = `att-${crypto.randomUUID()}`;
      query.run(
        'INSERT INTO quiz_attempts (id, user_id, category_id, score, total) VALUES (?, ?, ?, ?, ?)',
        [attemptId, req.user.id, category.id, score, total]
      );
    }

    res.json({
      success: true,
      data: {
        category: category.title,
        score,
        total,
        percentage,
        passed: percentage >= 60,
        results
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to evaluate quiz submission' });
  }
});

module.exports = router;

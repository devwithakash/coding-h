const express = require('express');
const router = express.Router();
const questionLinkController = require('../controllers/questionLinkController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/questions
router.post('/', protect, questionLinkController.addQuestion);

// @route   DELETE /api/questions/:id
router.delete('/:id', protect, questionLinkController.deleteQuestion);

// @route   PUT /api/questions/:id  <--- ADD THIS LINE
router.put('/:id', protect, questionLinkController.updateQuestion);

// @route   GET /api/questions/:id
router.get('/:id', protect, questionLinkController.getQuestionById);

module.exports = router;
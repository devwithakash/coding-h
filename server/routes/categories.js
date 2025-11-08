const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/categories
router.post('/', protect, categoryController.createCategory);

module.exports = router;
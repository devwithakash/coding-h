const express = require('express');
const router = express.Router();
const revisionController = require('../controllers/revisionController');
const { protect } = require('../middleware/authMiddleware');

// @route   PUT /api/revise/:id
router.put('/:id', protect, revisionController.toggleRevisionStatus);

module.exports = router;
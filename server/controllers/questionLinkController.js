const QuestionLink = require('../models/QuestionLink');
const Category = require('../models/Category');
const metadataService = require('../services/metadataService');

exports.addQuestion = async (req, res) => {
  try {
    // 1. Get all the new data from the request body
    const { url, categoryId, title, notes } = req.body;
    const userId = req.user._id;

    // 2. Verify category exists and belongs to user
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return res.status(404).send('Category not found or access denied.');
    }

    // 4. Build the QuestionLink
    const newQuestion = new QuestionLink({
      url,
      title: title || url, // Use the provided title, or default to the URL
      notes: notes || '',
      user: userId,
      category: categoryId,
      // 'status' and 'lastRevisedAt' will use their default values
    });

    await newQuestion.save();
    res.status(201).send('Question added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user._id;

    const question = await QuestionLink.findOne({ _id: questionId, user: userId });

    if (!question) {
      return res.status(404).send('Question not found or access denied.');
    }

    await QuestionLink.findByIdAndDelete(questionId);
    res.status(200).send('Question deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


// --- ADD THIS NEW FUNCTION ---
exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user._id;
    const { title, url, notes } = req.body; // Get new details from body

    // Find the question and verify ownership
    const question = await QuestionLink.findOne({ _id: questionId, user: userId });
    if (!question) {
      return res.status(404).send('Question not found or access denied.');
    }

    // Update the fields
    question.title = title || question.url; // Use new title, or default to URL
    question.url = url || question.url;     // Use new URL
    question.notes = notes || '';         // Use new notes

    await question.save();
    res.status(200).json(question); // Send back the updated question
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user._id;

    const question = await QuestionLink.findOne({ _id: questionId, user: userId });
    if (!question) {
      return res.status(404).send('Question not found or access denied.');
    }
    res.status(200).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

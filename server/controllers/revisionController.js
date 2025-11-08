const QuestionLink = require('../models/QuestionLink');

exports.toggleRevisionStatus = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user._id;

    const question = await QuestionLink.findOne({ _id: questionId, user: userId });
    if (!question) {
      return res.status(404).send('Question not found or access denied.');
    }

    // Toggle the status
    if (question.status === 'unrevised') {
      question.status = 'revised';
      question.lastRevisedAt = new Date(); // Set revision date
    } else {
      question.status = 'unrevised';
      // We'll keep the lastRevisedAt date, as it's still the last time they *did* revise it
    }

    await question.save();
    res.status(200).json(question); // Send back the updated question
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
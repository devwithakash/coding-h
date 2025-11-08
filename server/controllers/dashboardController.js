const Category = require('../models/Category');
const QuestionLink = require('../models/QuestionLink');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; // 'req.user' comes from our 'protect' middleware

    // 1. Get all categories for this user
    const categories = await Category.find({ user: userId }).lean(); // .lean() makes it faster

    // 2. Get all questions for this user
    const questions = await QuestionLink.find({ user: userId }).lean();

    // 3. Map questions into their categories
    const categoriesMap = categories.map(category => {
      // Find all questions belonging to this category
      // ... inside getDashboardData ...
    const categoryQuestions = questions
    .filter(q => q.category.toString() === category._id.toString())
    .map(q => ({
        id: q._id,
        url: q.url,
        title: q.title,
        description: q.description,
        topic: q.topic,
        notes: q.notes, // <-- ADD THIS
        status: q.status, // <-- ADD THIS
        lastRevisedAt: q.lastRevisedAt, // <-- ADD THIS
    }));
// ... rest of the function ...
      
      return {
        id: category._id,
        name: category.name,
        questions: categoryQuestions,
      };
    });

    res.status(200).json(categoriesMap);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
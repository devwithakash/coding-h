const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const newCategory = new Category({
      name,
      user: userId,
    });

    await newCategory.save();
    res.status(201).send('Category created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
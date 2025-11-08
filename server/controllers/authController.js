const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign a JWT
const signToken = (userId) => {
  // We'll add JWT_SECRET to the .env file in the next step
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h', 
  });
};

// --- 1. Register Logic ---
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email address already in use!');
    }

    // Create new user (password will be hashed by the 'pre-save' hook in the model)
    const newUser = new User({
      name,
      email,
      password,
      provider: 'local',
    });

    await newUser.save();

    res.status(201).send('User registered successfully');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during registration.');
  }
};

// --- 2. Login Logic ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user || user.provider !== 'local') {
      return res.status(401).send('Invalid email or password.');
    }

    // Check the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password.');
    }

    // User is valid, create a token
    const token = signToken(user._id);

    // Send the token back (same format as Spring Boot)
    res.status(200).json({
      accessToken: token,
      tokenType: 'Bearer',
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during login.');
  }
};

// --- ADD THIS FUNCTION ---
// @desc    Handle the Google callback
exports.googleCallback = (req, res) => {
  // Passport puts the authenticated user on req.user
  if (!req.user) {
    return res.status(401).send('User authentication failed.');
  }

  // 1. Sign our own JWT
  const token = signToken(req.user._id);

  // 2. Redirect back to the React app with the token
  // React's AuthCallbackPage will handle this URL
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
}
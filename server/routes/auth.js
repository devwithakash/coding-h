const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// --- Local Auth ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- Google OAuth ---

// @route   GET /api/auth/google
// @desc    Start the Google auth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // What we want from Google
    session: false, // We're using JWTs, not sessions
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`, // Redirect to login on fail
    session: false,
  }),
  authController.googleCallback // Our custom controller to send the JWT
);

module.exports = router;
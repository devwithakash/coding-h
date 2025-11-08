const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function is called after Google authenticates the user
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        // 1. Check if user already exists with this Google ID
        let user = await User.findOne({ providerId: id });

        if (user) {
          // User found, log them in
          return done(null, user);
        }

        // 2. No user with Google ID, check if email is already in use
        user = await User.findOne({ email });

        if (user) {
          // Email in use (e.g., local account). Link the Google ID.
          user.provider = 'google';
          user.providerId = id;
          user.name = displayName;
          user.password = undefined; // Remove local password
          await user.save();
          return done(null, user);
        }

        // 3. This is a completely new user
        const newUser = new User({
          provider: 'google',
          providerId: id,
          name: displayName,
          email: email,
        });

        await newUser.save();
        return done(null, newUser);
        
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
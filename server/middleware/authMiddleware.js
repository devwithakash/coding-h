const passport = require('passport');

// This is our route protection middleware
exports.protect = passport.authenticate('jwt', { session: false });
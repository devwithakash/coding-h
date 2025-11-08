const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() { return this.provider === 'local'; }, // Password only required for local accounts
  },
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google'],
    default: 'local',
  },
  providerId: {
    type: String, // Will store the user's Google ID
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// --- Mongoose Middleware ---
// This function runs *before* a user is saved
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's a new local user or the password has been modified
  if (this.provider !== 'local' || !this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// --- Mongoose Helper Method ---
// This adds a custom method to our User model to easily compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model('User', UserSchema);
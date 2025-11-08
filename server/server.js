require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
// --- Import Routes ---
const authRoutes = require('./routes/auth');
// We need to create these new route files
const dashboardRoutes = require('./routes/dashboard');
const categoryRoutes = require('./routes/categories');
const questionLinkRoutes = require('./routes/questionLinks');
const revisionRoutes = require('./routes/revision');
// --- Import Configs ---
// (This line executes the file, registering the Google strategy)
require('./config/passport'); 
// Import the new JWT strategy config
require('./config/jwtStrategy');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// --- Define Routes ---
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Auth routes are public
app.use('/api/auth', authRoutes);

// --- Protected Routes ---
// We'll create these route files next
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionLinkRoutes);
app.use('/api/revise', revisionRoutes);

// --- Start Server ---
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
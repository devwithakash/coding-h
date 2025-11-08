const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionLinkSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  title: String,
  description: String,
  topic: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  
  // --- NEW FIELDS TO ADD ---

  // For Feature 3: Notes
  notes: {
    type: String,
    default: '',
  },

  // For Feature 2: Revision System
  status: {
    type: String,
    enum: ['unrevised', 'revised'],
    default: 'unrevised',
  },
  lastRevisedAt: {
    type: Date,
    default: null,
  },

}, { timestamps: true });

module.exports = mongoose.model('QuestionLink', QuestionLinkSchema);
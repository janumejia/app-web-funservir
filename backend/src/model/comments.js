const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site', // Reference to the Site model, assuming you have a separate model for sites
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model, assuming you have a separate model for users
    required: true,
  },
  stars:{
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Comment', commentSchema);
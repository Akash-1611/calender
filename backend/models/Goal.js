const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
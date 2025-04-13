const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['exercise', 'eating', 'work', 'relax', 'family', 'social']
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  color: {
    type: String,
    default: '#3174ad'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
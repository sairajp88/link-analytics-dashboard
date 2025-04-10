const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: String,
  userAgent: String,
});

module.exports = mongoose.model('Click', clickSchema);

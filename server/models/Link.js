const mongoose = require('mongoose');

// Schema for individual click logs
const clickLogSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    default: null, // if user gives a custom alias
  },
  clickCount: {
    type: Number,
    default: 0, // total number of clicks
  },
  clickLogs: [clickLogSchema], // array of click metadata
  createdAt: {
    type: Date,
    default: Date.now, // stores creation date
  },
  expireAt: {
    type: Date,
    default: null, // optional expiration
  },
});

module.exports = mongoose.model('Link', linkSchema);

const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const shortid = require('shortid');

// @route   POST /api/links
// @desc    Create a new short link
router.post('/', async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  try {
    const shortUrl = customAlias || shortid.generate();
    const existing = await Link.findOne({ shortUrl });

    if (existing) {
      return res.status(400).json({ message: 'Alias or short URL already exists.' });
    }

    const newLink = new Link({
      originalUrl,
      shortUrl,
      alias: customAlias || null,
      expireAt: expiresAt || null,
    });

    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/links
// @desc    Get all links
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/links/:id
// @desc    Delete a link
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Link.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/links/:id/analytics
// @desc Get click data for a specific link
router.get('/:id/analytics', async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const clicks = link.clickLogs || [];

    // Example: group by date (YYYY-MM-DD)
    const grouped = {};
    clicks.forEach(({ timestamp }) => {
      const date = new Date(timestamp).toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    res.json({
      totalClicks: link.clickCount || 0,
      dailyClicks: grouped,
      devices: {}, // You can later extract device info if available
      userAgents: clicks.map(c => c.userAgent)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;

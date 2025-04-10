const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// @route   GET /:shortUrl
// @desc    Redirect to original URL + log the click
router.get('/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const link = await Link.findOne({ shortUrl });

    if (!link) {
      return res.status(404).send('Short link not found');
    }

    // Check for expiration
    if (link.expireAt && new Date() > link.expireAt) {
      return res.status(410).send('This link has expired');
    }

    // Log click
    const clickData = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
    };

    link.clickCount += 1;
    link.clickLogs.push(clickData);
    await link.save();

    // Redirect to original URL
    res.redirect(link.originalUrl);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during redirection');
  }
});

module.exports = router;

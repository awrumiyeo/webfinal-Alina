const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const { isEditor, isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Create Portfolio Item
router.post('/portfolio/create', isEditor, async (req, res) => {
  try {
    const { title, description, images } = req.body;

    const newPortfolioItem = new PortfolioItem({
      title,
      description,
      images,
      createdBy: req.user._id,
    });

    await newPortfolioItem.save();
    res.redirect('/portfolio');
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).send('Error creating portfolio item');
  }
});

module.exports = router;

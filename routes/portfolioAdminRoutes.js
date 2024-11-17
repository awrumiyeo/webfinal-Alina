const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const { isAdmin, isAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Create Portfolio Item
router.post('/portfolio/create', isAdmin, async (req, res) => {
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

// Update Portfolio Item
router.post('/portfolio/update/:id', isAdmin, async (req, res) => {
  try {
    const { title, description, images } = req.body;
    await PortfolioItem.findByIdAndUpdate(req.params.id, { title, description, images });
    res.redirect('/portfolio');
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).send('Error updating portfolio item');
  }
});

// Delete Portfolio Item
router.post('/portfolio/delete/:id', isAdmin, async (req, res) => {
  try {
    await PortfolioItem.findByIdAndDelete(req.params.id);
    res.redirect('/portfolio');
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).send('Error deleting portfolio item');
  }
});

module.exports = router;

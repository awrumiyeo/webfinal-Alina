const express = require('express');
const router = express.Router();
const PortfolioItem = require('../models/PortfolioItem');
const { checkAuth, checkRole } = require('../middleware/auth');

// Portfolio page
router.get('/', checkAuth, async (req, res) => {
  const items = await PortfolioItem.find();
  res.render('portfolio', { items, user: req.user });
});

// Create portfolio item (Admin and Editor)
router.post('/create', checkAuth, checkRole(['admin', 'editor']), async (req, res) => {
  const { title, description, images } = req.body;

  const newItem = new PortfolioItem({
    title,
    description,
    images: images.split(','), // Assuming images are comma-separated
  });

  await newItem.save();
  res.redirect('/portfolio');
});

// Update portfolio item (Admin only)
router.post('/update/:id', checkAuth, checkRole(['admin']), async (req, res) => {
  const { title, description, images } = req.body;
  await PortfolioItem.findByIdAndUpdate(req.params.id, {
    title,
    description,
    images: images.split(','),
  });
  res.redirect('/portfolio');
});

// Delete portfolio item (Admin only)
router.post('/delete/:id', checkAuth, checkRole(['admin']), async (req, res) => {
  await PortfolioItem.findByIdAndDelete(req.params.id);
  res.redirect('/portfolio');
});

module.exports = router;

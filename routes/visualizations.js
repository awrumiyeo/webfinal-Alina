const express = require('express');
const router = express.Router();

// Middleware to restrict editor access
function checkRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send('Access Denied');
    }
    next();
  };
}

// Static Visualizations Route (Accessible to all)
router.get('/visualizations', (req, res) => {
  res.render('visualizations'); // Render static visualizations
});

// Editor Visualizations Route (Accessible to editors only)
router.get('/editor-visualizations', checkRole('editor'), (req, res) => {
  res.render('editor-visualizations'); // Render page for editor-created visualizations
});



module.exports = router;

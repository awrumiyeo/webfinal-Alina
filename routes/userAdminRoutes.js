const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkRole } = require('../middleware/auth'); // Проверка роли

// Просмотр всех пользователей (доступно только admin)
router.get('/admin/users', checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.render('adminUsers', { users }); // Вывод всех пользователей
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Обновление роли пользователя
router.post('/admin/users/:id', checkRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.role = role;
    await user.save();

    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Error updating user role');
  }
});

module.exports = router;

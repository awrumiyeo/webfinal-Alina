const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle Registration
router.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, age, gender, email, role } = req.body;

  try {
    // Input validation
    if (!username || !password || !firstName || !lastName || !age || !gender || !email || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (role !== 'admin' && role !== 'editor') {
      return res.status(400).json({ error: 'Invalid role selected' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      gender,
      email,
      role,
    });

    await newUser.save();

    // Send success response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Login Route
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle Login
router.get('/login', (req, res) => {
  res.render('login'); // Ensure there is a login.ejs file in your views folder
});

// Handle login submission
router.post('/login', async (req, res) => {
  const { username, password, twoFactorCode } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid credentials');

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid credentials');

    // If 2FA code is not provided, send a new code
    if (!twoFactorCode) {
      const newTwoFactorCode = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit code
      user.twoFactorCode = newTwoFactorCode;
      user.twoFactorCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
      await user.save();

      // Send the 2FA code via email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is: ${newTwoFactorCode}`,
      };

      await transporter.sendMail(mailOptions);
      return res.send('2FA code sent to your email. Please enter it to log in.');
    }

    // Validate 2FA code
    if (twoFactorCode !== user.twoFactorCode || user.twoFactorCodeExpires < Date.now()) {
      return res.status(400).send('Invalid or expired 2FA code');
    }

    // Generate JWT token and clear 2FA code
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    res.redirect('/home'); // Redirect to home after login
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Login failed. Please try again.');
  }
});

module.exports = router;
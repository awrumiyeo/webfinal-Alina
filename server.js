require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();
const port = 3000;

const API_KEY = process.env.WEATHERMAP_API_KEY; 


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); // Для обработки данных формы
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Set view engine
app.set('view engine', 'ejs');

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes

// Home Route
app.get('/', (req, res) => {
  const user = req.cookies.user || null;
  res.render('home', { user });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Logout Route
app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/');
});
app.get('/login', (req, res) => {
  res.render('login');
});



// Use Routes from External Files
app.use('/', authRoutes);
app.use('/', portfolioRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/portfolio', (req, res) => {
  const items = []; // Replace with your portfolio items data fetched from the database
  const user = req.user || { role: 'guest' }; // Example user object
  res.render('portfolio', { items, user });
});

app.get('/air-quality', async (req, res) => {
  const lat = req.query.lat || 37.7749; // Default to San Francisco
  const lon = req.query.lon || -122.4194;

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const data = response.data;
    res.json({
      aqi: data.list[0].main.aqi,
      pollutants: data.list[0].components,
    });
  } catch (error) {
    console.error('Error fetching air quality data:', error.message);
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

module.exports = app;

// Start Server
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
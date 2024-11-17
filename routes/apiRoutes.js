const express = require('express');
const axios = require('axios');

const router = express.Router();

// API Keys
const weatherApiKey = 'ce98ed3875ac1b774e2ed64ebe678e31';
const nasaApiKey = 'qVSCSqV9fhopO42urs1eLhAa93ea8My0pdKzzoVB';

// Air Quality Route
app.get('/air-quality', async (req, res) => {
    const { lat, lon } = req.query;
    const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;
    try {
        const response = await axios.get(airQualityUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch air quality data' });
    }
});



module.exports = router;

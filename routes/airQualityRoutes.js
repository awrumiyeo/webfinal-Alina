const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/air-quality', async (req, res) => {
    const { lat, lon } = req.query; // Make sure `lat` and `lon` are passed in the request
    const apiKey = process.env.WEATHER_API_KEY; // Ensure you have the API key in your `.env`
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        const { main, components } = response.data.list[0];
        res.json({
            aqi: main.aqi,
            pollutants: components,
        });
    } catch (error) {
        console.error('Error fetching air quality data:', error.message);
        res.status(500).json({ error: 'Failed to fetch air quality data' });
    }
});

module.exports = router;

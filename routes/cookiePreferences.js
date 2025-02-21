const express = require('express');
const router = express.Router();
const CookiePreferences = require('../models/CookiePreferences');

// Save cookie preferences
router.post('/preferences', async (req, res) => {
    try {
        const { sessionId, accepted, preferences } = req.body;
        
        console.log('Received cookie preferences:', {
            sessionId,
            accepted,
            preferences
        });

        const newPreference = new CookiePreferences({
            sessionId,
            accepted,
            preferences
        });

        await newPreference.save();
        
        // Set cookie in response
        res.cookie('cookie_preferences', JSON.stringify({
            accepted,
            preferences
        }), { 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({ message: 'Cookie preferences saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving cookie preferences' });
    }
});

// Get cookie preferences
router.get('/preferences/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const preferences = await CookiePreferences.findOne({ sessionId }).sort({ timestamp: -1 });
        res.json(preferences || {});
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cookie preferences' });
    }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ success: false, message: 'Email already subscribed' });
        }

        // Create new subscriber
        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(201).json({ success: true, message: 'Subscription successful' });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ success: false, message: 'Subscription failed' });
    }
});

// Get all subscribers (for admin purposes)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ message: 'Error fetching subscribers' });
    }
});

module.exports = router; 
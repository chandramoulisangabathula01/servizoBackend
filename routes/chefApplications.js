const express = require('express');
const ChefApplication = require('../models/ChefApplication'); // Import your model
const router = express.Router();

// POST /api/chefs
router.post('/', async (req, res) => {
    try {
        const newApplication = new ChefApplication(req.body);
        await newApplication.save();
        res.status(201).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
        if (error.message.includes('already exists')) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            console.error('Error submitting application:', error);
            res.status(500).json({ success: false, message: 'Failed to submit application' });
        }
    }
});

// Get all applications
router.get('/', async (req, res) => {
    try {
        const applications = await ChefApplication.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications'
        });
    }
});

module.exports = router;
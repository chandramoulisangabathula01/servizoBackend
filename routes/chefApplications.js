const express = require('express');
const ChefApplication = require('../models/ChefApplication'); // Import your model
const router = express.Router();

// POST /api/chefs
router.post('/', async (req, res) => {
    try {
        const applicationData = req.body;
        console.log('Received application:', applicationData);

        // Create a new application in MongoDB
        const newApplication = new ChefApplication(applicationData);
        await newApplication.save();

        res.status(201).json({
            success: true,
            message: 'Application received successfully',
            data: newApplication
        });
    } catch (error) {
        console.error('Error processing application:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing application',
            error: error.message
        });
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
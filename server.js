require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servizo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/chefs', require('./routes/chefApplications'));
app.use('/api/cookies', require('./routes/cookiePreferences'));

// Import the newsletter route
const newsletterRoutes = require('./routes/newsletter');

// Add newsletter route
app.use('/api/newsletter', newsletterRoutes);

// Import mongoose and Newsletter model
const Newsletter = require('./models/Newsletter');

// Newsletter route
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;
    
    if (!email || !validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

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

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Example: Processing user preferences
app.post('/api/preferences', async (req, res) => {
    const { userId, preferences } = req.body;

    try {
        // Update user preferences in the database
        const user = await User.findByIdAndUpdate(
            userId,
            { preferences },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Preferences updated', user });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ success: false, message: 'Failed to update preferences' });
    }
});

// Example: Generating a report
// app.get('/api/newsletter/stats', async (req, res) => {
//     try {
//         const totalSubscribers = await Newsletter.countDocuments();
//         const recentSubscribers = await Newsletter.find()
//             .sort({ subscribedAt: -1 })
//             .limit(10);

//         res.status(200).json({
//             success: true,
//             data: {
//                 totalSubscribers,
//                 recentSubscribers,
//             },
//         });
//     } catch (error) {
//         console.error('Error fetching stats:', error);
//         res.status(500).json({ success: false, message: 'Failed to fetch stats' });
//     }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
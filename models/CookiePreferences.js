const mongoose = require('mongoose');

const cookiePreferencesSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    sessionId: { type: String, required: true },
    accepted: { type: Boolean, required: true },
    preferences: {
        necessary: { type: Boolean, default: true },
        analytics: { type: Boolean, default: false },
        marketing: { type: Boolean, default: false }
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CookiePreferences', cookiePreferencesSchema); 
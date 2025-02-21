const mongoose = require('mongoose');

const chefApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    availability: { type: [String], required: true },
    termsAccepted: { type: Boolean, required: true },
    consentForBackgroundCheck: { type: Boolean, required: true }
});

module.exports = mongoose.model('ChefApplication', chefApplicationSchema);
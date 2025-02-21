const mongoose = require('mongoose');

const chefApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    yearsOfExperience: { type: Number, required: true },
    availability: { type: [String], required: true },
    termsAccepted: { type: Boolean, required: true },
    consentForBackgroundCheck: { type: Boolean, required: true }
});

// Add pre-save hook to check for duplicates
chefApplicationSchema.pre('save', async function(next) {
    const application = this;
    
    // Check for duplicate email
    const existingEmail = await mongoose.model('ChefApplication').findOne({ email: application.email });
    if (existingEmail) {
        const error = new Error('Email already exists');
        error.status = 400;
        return next(error);
    }

    // Check for duplicate contact number
    const existingContact = await mongoose.model('ChefApplication').findOne({ contactNumber: application.contactNumber });
    if (existingContact) {
        const error = new Error('Contact number already exists');
        error.status = 400;
        return next(error);
    }

    next();
});

module.exports = mongoose.model('ChefApplication', chefApplicationSchema);
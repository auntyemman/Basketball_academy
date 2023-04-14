const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 32,
        minlenght: 2,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 32,
        minlenght: 2,
        trim: true
    },
    dob: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 100,
        minlenght: 3
    }
}, {timestamps: true})

module.exports = mongoose.model('userModel', userSchema);
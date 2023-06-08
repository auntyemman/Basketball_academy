const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 30,
        unique: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500,
        trim: true
    }
}, {timestamp: true})


module.exports = mongoose.model('blogModel', blogSchema);
const mongoose = required('mongoose');

const blogSchema = new mongoose.Schmema({
    name: {
        type: String,
        require: true,
        maxlength: 12,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 20,
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


module.exports = mongoose.model('blog', blogSchema);
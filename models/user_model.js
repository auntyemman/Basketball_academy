const mongoose = require('mongoose');
const crypto = require('crypto');
const {v4:uuidv4} = require('uuid');

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
    encry_password: {
        type: String,
        required: true
    },
    salt: String
}, {timestamps: true})

userSchema.virtual('password')
    .set((password) => {
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    }).get(() => {
        return this._password;
    });

userSchema.methods = {
    authenticate: () => {
        return this.securePassword(plainPassword) === this.encry_password;
    },
    securePassword: () => {
        if(!plainPassword) return '';
        
        try {
            return crypto.createHmac('sha256', this.salt).update(plainPassword).digest('hex');
        }
        catch(err) {
            return err;
        }
    }
};



module.exports = mongoose.model('userModel', userSchema);
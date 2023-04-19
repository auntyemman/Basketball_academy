const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/user_model');

//signup controller
exports.register = (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const dob = req.body.dob;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 8);
    
    const newUser = {firstname: firstname, lastname: lastname, dob: dob, email: email, password: password};

    userModel.create(newUser)
        .then((result) => {
            res.jsonp({success : true});
            //res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })
};

//forgot password controller
exports.forgotPassword = async (req, res) => {
    try {
        const oldUser = await userModel.findOne({ email: req.body.email });
        if (!oldUser){
            res.send('User does not exist');
        }
        const secret = process.env.JWT_SECRET + oldUser.password;
        const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {expiresIn: '10m'});
        link = `http://localhost:3000/reset_password/${oldUser._id}/${token}`;
        res.send('Password reset sent to your email');
        console.log(link);
    } catch (error) {
        console.log(error);
    }
};

//forgot password controller
exports.resetPassword = async (req, res) => {
    const {id, token} = req.params;
    const oldUser = await userModel.findOne({_id: id});
    if (!oldUser) {
        res.send('User do not exist');
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.send('Verified');
    } catch (error) {
        res.send('User not verified');
    }
    console.log(req.params);
};
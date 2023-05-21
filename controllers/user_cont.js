require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
        link = `http://localhost:3000/reset_password/${oldUser._id}/${token}`; //link url with user id and user token

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'auntyemman@gmail.com',
            pass: process.env.GMAIL_PASS
        }
        });

        const mailOptions = {
        from: 'Molebasketballacademy@gmail.com',
        to: req.body.email,
        subject: 'Password reset link from Mole Basketball Academy',
        html: `<h5>Follow the link below to reset your password</h5><p>${link}</p><p>Ignore this if you do not authorize it.</p>`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
        res.send('Password reset sent to your email');
        console.log(link);
    } catch (error) {
        console.log(error);
    }
};

//reset password controller
exports.resetPassword = async (req, res) => {
    const oldUser = await userModel.findOne({ _id: req.params.id });
    if (!oldUser) {
        res.send('User can not be reset');
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(req.params.token, secret);
        const encryptedPassword = bcrypt.hashSync(req.body.password, 8); //Encrypting the reset password
        await userModel.updateOne(
            {
                _id: req.params.id,
            }, 
            {
                $set: {password: encryptedPassword,}
            },
            );
        res.send('Password updated');
    } catch (error) {
        res.send('Something went wrong');
        console.log(error);
    }
};

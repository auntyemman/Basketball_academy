const userModel = require('../models/user_model');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const dob = req.body.dob;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 8);
    
    const newUser = {firstname: firstname, lastname: lastname, dob: dob, email: email, password: password};

    userModel.create(newUser)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        })
}
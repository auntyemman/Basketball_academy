const userModel = require('../models/user_model');
const bcrypt = require('bcryptjs');

exports.register = (req, res) => {
    const user = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dob: req.body.dob,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
  
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
    }
    })
};

/*
exports.register = (req, res) => {
    const user = new userModel(req.body);
    user.save((err, newUser) => {
        if(err) {
            return res.status(400).json({
                error: 'Unable to add user'
            })
        }
        return res.staus(200).json({
            msg: 'User successfully added',
            newUser
        })
    });
};
*/
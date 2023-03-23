const userModel = require('../models/user_model');

exports.register = (req, res) => {
    const user = new userModel(req.body);
    userModel.save((err, newUser) => {
        if(err) {
            return res.status(400).json({
                error: 'Unable to add user'
            })
        }
        return res.staus(200).json({
            msg: 'User successfully added',
            newUser
        })
    })
};
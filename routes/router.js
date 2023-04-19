const express = require('express');
const userModel = require('../models/user_model');
const { register, forgotPassword, resetPassword } = require('../controllers/user_cont')
const bcrypt = require('bcryptjs');

const router = express.Router();

//signing up or registration route
router.post('/register', register);

//forgot password route
router.post('/forgot_password', forgotPassword);

//reset password route
router.post('/reset_password', resetPassword);

// login user route
router.post('/login', async (req, res) => {
    try {
        // check if the user exists
        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
          //check if password matches
          const result = bcrypt.compareSync(req.body.password, user.password);
          /*const result = req.body.password === user.password;*/
          if (result) {
            req.session.user = req.body.email;
            res.redirect('/route/dashboard');
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

// dashboard route
router.get('/dashboard', (req, res) => {
    if(req.session.user) {
        res.render('dashboard', {user: req.session.user});
    }else {
        res.send('Unauthorized user!');
    }
});

// logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.send('Error!');
        }else {
            res.render('index');
        }
    })
});

module.exports = router;

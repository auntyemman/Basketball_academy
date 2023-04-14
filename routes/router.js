const express = require('express');
const userModel = require('../models/user_model');
const { register } = require('../controllers/user_cont')
const bcrypt = require('bcryptjs');

const router = express.Router();

//signing up or registration
router.post('/register', register);

// login user route
router.post('/login', async (req, res) => {
    /*if(req.body.email === userModel.email && req.body.password === userModel.password) {
        req.session.user = req.body.email;
        res.redirect('/route/dashboard');
    } else {
        res.end('Invalid email or password');
    };*/
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
        console.log(error);
      }
});

// dashboard route
router.get('/dashboard', (req, res) => {
    if(req.session.user) {
        res.render('dashboard', {user:req.session.user});
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

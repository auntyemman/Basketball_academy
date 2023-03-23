const express = require('express');
const { register } = require('../controllers/user_cont')

const router = express.Router();

const credential = {
    email: 'mole@gmail.com',
    password: 'mole'
};

//signing up or registration
router.post('/register', register);

// login user route
router.post('/login', (req, res) => {
    if(req.body.email === credential.email && req.body.password === credential.password) {
        req.session.user = req.body.email;
        res.redirect('/route/dashboard');
        //res.end('login successful');
    } else {
        res.end('Invalid email or password');
    };
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

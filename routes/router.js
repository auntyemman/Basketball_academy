const express = require('express');
const userModel = require('../models/user_model');
const { register, forgotPassword, resetPassword } = require('../controllers/user_cont')
const bcrypt = require('bcryptjs');


const router = express.Router();
/*---------------------------------------------post requests-------------------------------------------*/

//signing up or registration route
router.post('/register', register);

//forgot password route
router.post('/forgot_password', forgotPassword);

//reset password route
router.post('/reset_password/:id/:token', resetPassword);

// login user route
router.post('/login', async (req, res) => {
    try {
        // check if the user exists
        const user = await userModel.findOne({ email: req.body.email });
        console.log(user._id);
        if (user) {
          //check if password matches
          const result = bcrypt.compareSync(req.body.password, user.password);
          if (result) {
            req.session.user = req.body.email;
            res.redirect("/route/dashboard/" + user._id);
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

/*----------------------------xxx-----------------post requests-------------------xxxx-----------------------*/


/*---------------------------------------------get requests-------------------------------------------*/
// dashboard route
router.get('/dashboard/:id', async(req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    console.log(req.params);
    //console.log(user);
    if(req.params.id) {
        res.render('dashboard', {user: user.firstname});
    }else {
        res.send('Unauthorized user!');
    }
  } catch (error) {
    console.log(error);
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

/*---------------------------------------xxx------get requests-----xxx--------------------------------------*/
module.exports = router;

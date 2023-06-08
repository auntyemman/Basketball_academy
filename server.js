require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
//const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {v4:uuidv4} = require('uuid');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user_model');
const blogModel = require('./models/blog_model');
//const { resetPassword } = require('./controllers/user_cont')

const app = express();
const port = process.env.PORT || 3000;


//template engine
app.set('view engine', 'ejs');

//load css from static
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/images', express.static(path.join(__dirname, 'images')));

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected');
}).catch(() => {
    console.log('Unable to connect to database');
});

//parsing middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true}
}));
/*
app.use(passport.initialize());
app.use(passport.session());
*/
 
//routes folder files import
const router = require('./routes/router');
const blog = require('./routes/blog');
//using routes model
app.use('/route', router);
app.use('/blog', blog);

/*
//googleApi routes folder import
const googleApi = require('./routes/google_auth');
//using routes model
app.use('/api/auth', googleApi);
*/
/*--------------------------------------testing google auth get request-----------------------------------------*/
/*
//onst googleAuth = require('./middlewares/google_auth');
require('./src/config/google');

app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  app.get(
    "/api/auth/google/redirect",
    passport.authenticate("google", {
      failureRedirect: "/",
      successRedirect: "/profile",
      failureFlash: true,
      successFlash: "Successfully logged in!",
    })
  );
  */
/*----------------------------xxx-------testing google auth get request----------xxx----------------------------*/


// login route
app.get('/login', (req, res) => {
    res.render('login')
});
//home route
app.get('/', (req, res) => {
    res.render('index')
});
//about route
app.get('/about', (req, res) => {
    res.render('about')
});
//training route
app.get('/training', (req, res) => {
    res.render('training')
});
//blog route
app.get('/blog', (req, res) => {
    res.render('blog')
});
//contact route
app.get('/contact', (req, res) => {
    res.render('contact')
});
//registration route
app.get('/register', (req, res) => {
    res.render('register')
});
//user forgot password route
app.get('/forgot_password', (req, res) => {
    res.render('forgot_password')
});
/*reset password route from controller
app.get('/reset_password/:id/:token', (req, res) => {
    res.render('reset_password');
});*/
  
//get request for reset password
app.get('/reset_password/:id/:token', async(req, res) => {
    const oldUser = await userModel.findOne({ _id: req.params.id });
    if (!oldUser) {
      return res.send('User does not exist!!!');
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(req.params.token, secret);
      res.render('reset_password', {email: verify.email, id: req.params.id, token:req.params.token});
    } catch (error) {
      console.log(error);
      res.send('Not verified');
    }
  });

app.get('/blog_posts/:id', async(req, res) => {
  const post = await blogModel.findOne({_id: req.params.id});
  console.log(post);
  if (!post) {
    res.send('Not accessible');

  }
  try {
    res.render('blog',{comment: post.comment, id: req.params.id});
  } catch (error) {
    console.log(error);
  }
})
// running the app
app.listen(port, () => console.log('server connected at port 3000'));
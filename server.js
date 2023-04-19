const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {v4:uuidv4} = require('uuid');
const cors = require('cors');
require('dotenv').config();
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
    saveUninitialized: true
}));

//routes folder import
const router = require('./routes/router');
//using routes
app.use('/route', router);

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
//reset password route from controller
app.get('/reset_password/:id/:token', (req, res) => {
    res.render('reset_password');
});

app.listen(port, () => console.log('server connected at port 3000'));
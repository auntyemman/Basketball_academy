const express = require('express');
const blog = express.Router();
//const blogModel =require('../models/blog_model');
const { blogPost } = require('../controllers/blog_cont');


//blog post
blog.post('/blog_posts/:id', blogPost);


// exporting the module
module.exports = blog;


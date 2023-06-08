const blogModel = require('../models/blog_model');

// blog posts controller
exports.blogPost = async (req, res) => {
    // retrieves all data from the frontend
    const name = req.body.name;
    const email = req.body.email;
    const comment = req.body.comment;

    // makes all the data an object
    newPost = {name:name, email:email, comment:comment};
    
    const post = await blogModel.findOne({ _id: req.params.id });
    console.log(post);
    if (!post) {
        res.send('sign up to post')
    }
    // create a new entry in the database and return a promise
    blogModel.create(newPost)
    .then((result) => {
        res.jsonp({success : true});
        //res.send(result);
    })
    .catch((err) => {
        res.send(err);
    });

}
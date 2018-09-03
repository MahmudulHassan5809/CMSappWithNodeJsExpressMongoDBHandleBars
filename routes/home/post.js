const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Posts Model
require('../../models/Posts');
const Post = mongoose.model('posts');

//Load Categories Model
require('../../models/Categories');
const Category = mongoose.model('categories');

router.all('/*',(req , res , next)=>{
  req.app.locals.layout = 'main';
  next();
});

//Show Single Post
router.get('/show/:slug',(req , res) => {

 Post.findOne({slug: req.params.slug})
  .sort({date:'desc'})
  .populate('user')
  .populate({path: 'comments' ,match: {approveComment : true} ,populate: {path: 'user',model:'users'}})
  .then(post => {
    Category.find({})
  	.then(categories => {
       res.render('home/show',{
    	post: post,
    	categories: categories
     });
   });
 });

});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const faker = require('faker');

//Load Idea Model
require('../../models/Posts');
const Post = mongoose.model('posts');

//Load Idea Model
require('../../models/Comments');
const Comment = mongoose.model('comments');

//Load Idea Model
require('../../models/Categories');
const Category = mongoose.model('categories');

//Load Helpers
const {ensureAuthenticated} = require('../../helpers/auth');

router.all('/*',ensureAuthenticated,(req , res , next)=>{
  req.app.locals.layout = 'admin';
  next();
});


//Generate Fake Posts
router.post('/generate-fake-posts',(req , res)=>{
  for(let i = 0 ; i < req.body.amount ; i++){
  	let post = new Post();

    post.title =  faker.name.title();
    post.slug = faker.name.title();
    post.status = 'public';
    post.allowComments = faker.random.boolean();
    post.body   = faker.lorem.sentence();
    //post.file = faker.image.image();

    post.save()
    .then((post)=>{

    });
  }
  res.redirect('/admin/posts');
});


//Index Page
// router.get('/',(req , res) => {

//  const title = 'Home';
//  Post.count({})
//  .then(postCount => {
//      Comment.count({}).
//       then(countComment => {
//          res.render('admin/index',{
//             title:title,
//             postCount: postCount,
//             countComment: countComment
//          });
//       });
//  });
// });

router.get('/',(req,res) => {

 const promises = [
     Post.count().exec(),
     Category.count().exec(),
     Comment.count().exec()
   ]

   Promise.all(promises).then(([postCount,categoryCount,commentCount]) =>{
      res.render('admin/index',{
         postCount: postCount,
         categoryCount: categoryCount,
         commentCount: commentCount
      });
   });

});


//Dashboard Page
router.get('/dashboard',(req , res) => {
 const title = 'Dashboard';
 res.render('admin/dashboard',{
 	title:title
 });

});



module.exports = router;

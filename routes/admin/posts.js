const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');

const { isEmpty,uploadDir } = require('../../helpers/upload-helper');

//Load Helpers
const {ensureAuthenticated} = require('../../helpers/auth');

//Load Posts Model
require('../../models/Posts');
const Post = mongoose.model('posts');

//Load Categories Model
require('../../models/Categories');
const Category = mongoose.model('categories');


router.all('/*',(req , res , next)=>{
  req.app.locals.layout = 'admin';
  next();
});


//All Posts
router.get('/',ensureAuthenticated,(req , res) => {

 const title = 'All Posts';
 Post.find({})
  .sort({date:'desc'})
  .populate('category')
  .then(posts => {
    res.render('admin/posts/index',{
    	title: title,
    	posts: posts
    });
  });

});

//My Post
router.get('/my-posts',ensureAuthenticated,(req , res) => {

 const title = 'All Posts';
 Post.find({user: req.user.id})
  .sort({date:'desc'})
  .populate('category')
  .then(posts => {
    res.render('admin/posts/myposts',{
      title: title,
      posts: posts
    });
  });

});


//Create Post Page
router.get('/create',ensureAuthenticated,(req , res) => {

 const title = 'Create Post';
 Category.find({})
 .then(categories => {
      res.render('admin/posts/create',{
      title: title,
      categories: categories
     });
  });

});

//Post From Process
router.post('/create',ensureAuthenticated,(req , res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({err_msg:"Please add a title"});
  }
  if(!req.files.file){
    errors.push({err_msg:"Please add a File"});
  }
  if(!req.body.body){
    errors.push({err_msg:"Please add a Body"});
  }
  if(errors.length > 0){
    res.render('admin/posts/create',{
      errors : errors
    })
  }
  else{
  let fileName = '';
  if(!isEmpty(req.files)){
    let file = req.files.file;
    fileName = Date.now() + file.name;
    let dirUploads = './public/uploads/';
    file.mv(dirUploads + fileName,(err)=>{
       if(err) throw err;
    });
  }

  let allowComments;
  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

   const newPost = {
     user: req.user.id,
   	 title: req.body.title,
   	 status: req.body.status,
   	 allowComments: allowComments,
   	 body: req.body.body,
     category: req.body.category,
     file: fileName
   };

  //Create Story
  new Post(newPost)
  .save()
  .then(post => {
     req.flash('success_msg','Post Created SuccessFully...');
     res.redirect('/admin/posts');
  });
 }

// .catch(validator=>{
//     res.render('admin/posts/create'{
//       errors: validator.errors;
//     });

});

//Edit Routes
router.get('/edit/:id',ensureAuthenticated,(req , res) => {
  Post.findOne({
    _id : req.params.id
  })
  .then(post => {
    Category.find({})
    .then(categories => {
        res.render('admin/posts/edit',{
        post: post,
        categories: categories
       });
    });
  });
});

//Edit Form Process
router.put('/edit/:id',ensureAuthenticated,(req , res) => {
  Post.findOne({
    _id : req.params.id
  })
  .then(post => {

    let allowComments;

    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    //New values
     post.user = req.user.id;
     post.title = req.body.title;
     post.status = req.body.status;
     post.allowComments = allowComments;
     post.body = req.body.body;
     post.category = req.body.category;

    if(!isEmpty(req.files)){
    let file = req.files.file;
    fileName = Date.now() + file.name;
    post.file = fileName;
    let dirUploads = './public/uploads/';
    file.mv(dirUploads + fileName,(err)=>{
       if(err) throw err;
    });
   }

    post.save()
    .then(post => {
       req.flash("success_msg","Post Updated SuccessFully..");
       res.redirect('/admin/posts/my-posts');
    });
   });
});

//Delete Posts
router.delete('/delete/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
    .populate('comments')
    .then(post =>{
        fs.unlink(uploadDir + post.file, (err)=>{
            if(!post.comments.length < 1){
                post.comments.forEach(comment=>{
                 comment.remove();
                });
            }
          post.remove().then(postRemoved=>{
             req.flash('success_msg', 'Post was successfully deleted');
             res.redirect('/admin/posts/my-posts');
           });
     });

     });
});

module.exports = router;

const url = require('url');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//Load Comments Model
require('../../models/Comments');
const Comment = mongoose.model('comments');

//Load Comments Model
require('../../models/Posts');
const Post = mongoose.model('posts');

router.all('/*',(req , res , next)=>{
  req.app.locals.layout = 'admin';
  next();
});

router.post('/',(req , res) => {
  Post.findOne({_id: req.body.id})
   .then(post => {
       const newComment = new Comment({
          user: req.user.id,
          body: req.body.body
       });

       post.comments.push(newComment);
       post.save()
       .then(savedPost => {
          newComment.save()
          .then(savedComment => {
             req.flash('success_msg','Your Comment is Waiting For Approvement...')
          	 res.redirect(`/post/show/${post.id}`);
          });
       });
   });
});


router.get('/',(req , res) => {
  Comment.find({user: req.user.id})
  .populate('user')
   .then(comments => {
      res.render('admin/comments/index',{
        comments: comments
      })
   });

});

//Delete Comments
router.delete('/delete/:id',(req , res) => {
   Comment.remove({_id: req.params.id})
   .then(()=>{
    Post.findOneAndUpdate({comments: req.params.id},{$pull: {comments: req.params.id}},(err ,data) => {
        if(err) return err;

        req.flash("success_msg","Comments Deleted SuccessFully..");
        res.redirect('/admin/comments');
    });

   });
});

router.post('/approve-comment',(req ,res)=>{
  Comment.findByIdAndUpdate(req.body.id,{$set: {approveComment: req.body.approveComment}},(err , result)=>{
    if(err) return err;
    res.send(result);
  });
});

module.exports = router;

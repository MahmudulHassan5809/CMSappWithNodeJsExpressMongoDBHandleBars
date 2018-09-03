const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

//Load Posts Model
require('../../models/Posts');
const Post = mongoose.model('posts');
//Load Categories Model
require('../../models/Categories');
const Category = mongoose.model('categories');
//Load Categories Model
require('../../models/Users');
const User = mongoose.model('users');

//passport config
require('../../config/passport')(passport)


router.all('/*',(req , res , next)=>{
  req.app.locals.layout = 'main';
  next();
});


//Index Page
router.get('/',(req , res) => {
 const perpage = 10;
 const page = req.query.page || 1;
 Post.find({status:'public'})
  .skip((perpage * page) - perpage)
  .limit(perpage)
  .sort({date:'desc'})
  .then(posts => {
    Post.count()
    .then(postCount => {
        Category.find({})
    .then(categories => {
       res.render('home/index',{
      posts: posts,
      categories: categories,
      current: parseInt(page),
      pages: Math.ceil(postCount/perpage)

         });

     });

  });


 });

});


//About Page
router.get('/about',(req , res) => {

 res.render('home/about');

});

//Login Page
router.get('/login',(req , res) => {

 res.render('home/login');

});

//Login Form Process
router.post('/login',(req , res , next) => {
    passport.authenticate('local', {
    successRedirect:'/admin',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);

});


//Logout Page
router.get('/logout',(req , res) => {
 req.logout()
 res.render('home/login');

});

//Regiter Page
router.get('/register',(req , res) => {

 res.render('home/register');

});

//Regiter Form Process
router.post('/register',(req , res) => {
   let errors = [];
   if(!req.body.firstName) {

        errors.push({err_msg: 'please enter your first name'});
    }
    if(!req.body.lastName) {

        errors.push({err_msg: 'please add a last name'});
    }
    if(!req.body.email) {

        errors.push({err_msg: 'please add an email'});
    }
    if(!req.body.password) {

        errors.push({err_msg: 'please enter a password'});
    }
    if(!req.body.passwordConfirm) {

        errors.push({err_msg: 'This field cannot be blank'});
     }
    if(req.body.password !== req.body.passwordConfirm) {

        errors.push({err_msg: "Password fields don't match"});
     }


    if(errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
      });
    }else {
     User.findOne({email: req.body.email})
     .then(user => {
         if(!user){
             const newUser = new User({
             firstName: req.body.firstName,
             lastName: req.body.lastName,
             email: req.body.email,
             password: req.body.password,
           });

           bcrypt.genSalt(10 , (err , salt)=>{
              bcrypt.hash(newUser.password , salt , (err , hash)=>{
                  newUser.password = hash;
                  newUser.save()
                   .then(savedUser => {
                       req.flash('success_msg','You Are Registered Now Please Login..');
                       res.redirect('/login');
                   });
              });
           });

         }else{
           req.flash('error_msg','Email Already Exists...');
           res.redirect('/register');
         }
     });

  }


});



module.exports = router;

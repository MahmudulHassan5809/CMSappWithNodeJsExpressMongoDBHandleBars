const LoacalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');



//Load Idea
require('../models/Users');
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(new LoacalStrategy({usernameField: 'email'}, (email,password,done) => {
     console.log(email);
     //Match user
     User.findOne({
     	email:email
     }).then(user => {
     	if(!user){
           return done(null , false , {message : 'No user Found'});
     	}

     	//Match Password
     	bcrypt.compare(password , user.password, (err , isMatch) => {
     		if(err) throw  err;
     		if(isMatch){
     			return done(null , user);
     		}else{
     			return done(null , false , {message : 'Password Not Correct'});
     		}
     	})
     })
  }));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
}

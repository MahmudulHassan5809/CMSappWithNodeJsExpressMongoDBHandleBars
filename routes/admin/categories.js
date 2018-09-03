const url = require('url');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Helpers
const {ensureAuthenticated} = require('../../helpers/auth');


//Load Idea Model
require('../../models/Categories');
const Category = mongoose.model('categories');

router.all('/*',ensureAuthenticated,(req , res , next)=>{
  req.app.locals.layout = 'admin';
  next();
});


//Index Page
router.get('/',(req , res) => {

 const title = 'Categories';
 Category.find({})
  .sort({date:'desc'})
  .then(categories => {
    res.render('admin/categories/index',{
    	title: title,
    	categories: categories
    });
  });

});


//Category From Process
router.post('/create',(req , res) => {
  const newCategory = {
   	 name: req.body.name,
   	};

  //Create Story
  new Category(newCategory)
  .save()
  .then(post => {
     req.flash('success_msg','Category Created SuccessFully...');
     res.redirect('/admin/categories');
  });


});

//Edit Routes
router.get('/edit/:id',(req , res) => {
  Category.findOne({
    _id : req.params.id
  })
  .then(category => {
    res.render('admin/categories/edit',{
      category : category
    });
  });
});


//Edit Form Process
router.put('/edit/:id',(req , res) => {
  Category.findOne({
    _id : req.params.id
  })
  .then(category => {
    //New values
    category.name = req.body.name;
    category.save()
    .then(category => {
       req.flash("success_msg","Category Updated SuccessFully..");
       res.redirect('/admin/categories');
    });
   });
});

//Delete Categories
router.delete('/delete/:id',(req , res) => {
   Category.remove({_id: req.params.id})
   .then(()=>{
     req.flash("success_msg","Category Deleted SuccessFully..");
     res.redirect('/admin/categories');
   });
});


module.exports = router;

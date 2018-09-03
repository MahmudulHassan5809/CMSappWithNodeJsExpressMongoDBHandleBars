const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');



const app = express();


//Load FrontEnd Routes
const home = require('./routes/home/home');
const frontPost = require('./routes/home/post');

//Load BackEnd Routes
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');


//Static Folder
app.use(express.static(path.join(__dirname,'public')));


//HandleBars Helpers
const {
  truncate,
  stripTags,
  select,
  formatDate,
  paginate
} = require('./helpers/hbs');


//HandleBars MiddleWare
app.engine('handlebars', exphbs({
  helpers:{
    truncate: truncate,
    stripTags: stripTags,
    select: select,
    formatDate: formatDate,
    paginate: paginate
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// fileUpload options
app.use(fileUpload());

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Method Override
app.use(methodOverride('_method'))

//Session Express
app.use(session({
  secret: 'screet',
  resave: false,
  saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session())


//Connect Flash
app.use(flash());

//Global Variable
app.use(function(req , res , next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//DB Config
const db = require('./config/database');
//Map Gloabal Promise -get rid of warning
mongoose.Promise = global.Promise;
//Connect To Mongoose
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true
})
.then(() => { console.log('mongodb Connected');})
.catch(err => console.log(err));


/*************FrontEnd********/
//Home routes
app.use('/',home);
app.use('/post',frontPost);

/*************BackEnd********/
//Admin index Routes
app.use('/admin',admin);
//Admin posts Routes
app.use('/admin/posts',posts);
//Admin Categories Routes
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);

const port = process.env.PORT || 4500;
app.listen(port,() => {
	console.log(`Sever Started on port ${port}`);
});

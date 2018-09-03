const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

//Create Schema
const PostSchema = new Schema({
  user:{
     type:Schema.Types.ObjectId,
     ref: 'users'
  },
  category:{
     type: Schema.Types.ObjectId,
     ref: 'categories'
  },
  title:{
  	type: String,
  	required: true
  },
  slug:{
    type: String
  },
  status:{
   type: String,
   default: 'public'
  },
  allowComments:{
   type: Boolean,
   required: true
  },
  body:{
   type: String,
   required: true
  },
  file:{
   type: String

  },

  comments:[{
   type: Schema.Types.ObjectId,
   ref: 'comments'
  }],
  date: {
  	type: Date,
  	default: Date.now
  }
},{usePushEach: true});

PostSchema.plugin(URLSlugs('title',{field: 'slug'}));

mongoose.model('posts',PostSchema);


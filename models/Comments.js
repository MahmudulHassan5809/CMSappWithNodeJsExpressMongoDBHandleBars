const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CommentSchema = new Schema({
  user:{
  	type: Schema.Types.ObjectId,
  	ref: 'users'
  },
  body:{
  	type: String,
  	required: true
  },
  approveComment:{
    type: Boolean,
    default: false
  },
  date: {
  	type: Date,
  	default: Date.now
  }
});

mongoose.model('comments',CommentSchema);

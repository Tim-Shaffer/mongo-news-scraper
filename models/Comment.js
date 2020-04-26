// require necessary package
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new CommentSchema object
var CommentSchema = new Schema({
  tagLine: {
    type: String,
    required: " is Required"
  },
  comment: {
    type: String,
    required: "Comment is Required"
  },
  user: {
    type: String,
    required: "User is Required",
    trim: true
  },
  userCreated: {
    type: Date,
    default: Date.now
  }
});

// Creates a Comment model from the schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;

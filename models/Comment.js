var mongoose = require("mongoose");

var Schema = mongoose.Schema;

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

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;

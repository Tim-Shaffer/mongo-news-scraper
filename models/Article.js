var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  headline: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  byLine: {
    type: String,
    required: false
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

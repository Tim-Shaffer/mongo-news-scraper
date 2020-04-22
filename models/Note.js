var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  comment: {
    type: String,
    trim: true,
    required: "Comment is Required"
  },
  userCreated: {
    type: Date,
    default: Date.now
  }
});

var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;

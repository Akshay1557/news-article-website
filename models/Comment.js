
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // link to User who wrote the comment
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article", // link to the Article
  }
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);

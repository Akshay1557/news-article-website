
const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "love", "dislike"], // add more if needed
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article"
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }
}, { timestamps: true });

module.exports = mongoose.model("Reaction", reactionSchema);

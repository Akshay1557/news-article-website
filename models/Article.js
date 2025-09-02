const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  content: { type: String, required: true },
  summary: String,
  coverImage: String,

  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  tags: [String],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  views: { type: Number, default: 0 },

  // comments part
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],

  //  reactions part
  reactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reaction"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);

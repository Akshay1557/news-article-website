// controllers/commentController.js
const Comment = require("../models/Comment");
const Article = require("../models/Article");

// Create Comment
exports.createComment = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).send("Article not found");

    const comment = new Comment({
      text: req.body.text,
      author: req.user._id,
      article: article._id
    });

    await comment.save();

    // push comment into article
    article.comments.push(comment._id);
    await article.save();

    res.redirect(`/articles/${article._id}#comments`);
  } catch (err) {
    res.status(400).send("Error adding comment: " + err.message);
  }
};

// Edit Comment Form
exports.editCommentForm = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).send("Comment not found");

  if (!req.user || comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).send("Not authorized");
  }

  res.render("comments/edit", { comment, articleId: req.params.articleId });
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).send("Comment not found");

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    comment.text = req.body.text;
    await comment.save();

    res.redirect(`/articles/${req.params.articleId}#comments`);
  } catch (err) {
    res.status(400).send("Error updating comment: " + err.message);
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).send("Comment not found");

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized");
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    // remove from article.comments
    await Article.findByIdAndUpdate(req.params.articleId, {
      $pull: { comments: comment._id }
    });

    res.redirect(`/articles/${req.params.articleId}#comments`);
  } catch (err) {
    res.status(400).send("Error deleting comment: " + err.message);
  }
};

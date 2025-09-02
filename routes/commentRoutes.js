
const express = require("express");
const router = express.Router();
const {
  createComment,
  editCommentForm,
  updateComment,
  deleteComment
} = require("../controllers/commentController");

// Middleware to check if logged in
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/users/login");
}

// CREATE Comment
router.post("/articles/:articleId/comments", isAuthenticated, createComment);

// EDIT Comment Form
router.get("/articles/:articleId/comments/:commentId/edit", isAuthenticated, editCommentForm);

// UPDATE Comment (PUT)
router.put("/articles/:articleId/comments/:commentId", isAuthenticated, updateComment);

// DELETE Comment
router.delete("/articles/:articleId/comments/:commentId", isAuthenticated, deleteComment);

module.exports = router;

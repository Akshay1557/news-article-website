
const express = require("express");
const router = express.Router();
const { toggleReaction } = require("../controllers/reactionController");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/users/login");
}

// toggle reaction
router.post("/articles/:articleId/reactions", isAuthenticated, toggleReaction);

module.exports = router;

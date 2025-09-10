const express = require("express");
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  showEditForm,
  showNewForm,
  getMyArticles
} = require("../controllers/articleController");
const { upload } = require("../cloudinary");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

// Show logged-in user’s own articles
router.get("/my-articles", isAuthenticated, getMyArticles);

// Show all articles
router.get("/", getArticles);

// Show form to create new article (protected)
router.get("/new", isAuthenticated, showNewForm);

// Create article (with image upload, protected)
router.post("/", isAuthenticated, upload.single("image"), createArticle);

// Show form to edit article (protected)
router.get("/edit/:id", isAuthenticated, showEditForm);

// Update article (with image upload, protected)
router.post("/edit/:id", isAuthenticated, upload.single("image"), updateArticle);

// Delete article (protected)
router.post("/delete/:id", isAuthenticated, deleteArticle);

// Show one article (must be last to avoid conflicts)
router.get("/:id", getArticleById);

module.exports = router;

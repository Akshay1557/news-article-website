const express = require("express");
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  showEditForm,
  showNewForm
} = require("../controllers/articleController");
const { upload } = require("../cloudinary");

const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

// Show all articles
router.get("/", getArticles);

// Show form to create new article (protected)
router.get("/new", isAuthenticated, showNewForm);

// Create article with image upload
router.post("/", upload.single("image"), createArticle);

// Update article with image upload
router.post("/:id", upload.single("image"), updateArticle);


// Create new article (protected)
router.post("/", isAuthenticated, createArticle);

// Show form to edit article (protected)
router.get("/edit/:id", isAuthenticated, showEditForm);

// Update article (protected)
router.post("/edit/:id", isAuthenticated, updateArticle);

// Delete article (protected)
router.post("/delete/:id", isAuthenticated, deleteArticle);

// Show one article (this must come LAST)
router.get("/:id", getArticleById);

module.exports = router;

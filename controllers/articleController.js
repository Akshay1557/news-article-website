const Article = require("../models/Article");
const { upload } = require("../cloudinary"); // ⬅ import  upload

// Show form to create a new article
exports.showNewForm = (req, res) => {
  res.render("articles/new");  
};





// Create Article (C)
exports.createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      authorId: req.user._id
    };

    // ✅ If an image was uploaded, Cloudinary gives us `req.file.path`
    if (req.file) {
      articleData.image = req.file.path;
    }

    const article = new Article(articleData);
    await article.save();

    res.redirect("/articles");
  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Get All Articles (R)
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("authorId categoryId");
    res.render("articles/index", { articles, user: req.user }); // ✅ added user
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Get Single Article (R)
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("authorId categoryId")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" }
      })
      .populate({
        path: "reactions",   //  populate reactions
        populate: { path: "user", select: "name email" } // so you also know who reacted
      });

    if (!article) return res.status(404).send("Article not found");

    res.render("articles/show", { article, user: req.user }); // ✅ pass logged-in user too
  } catch (err) {
    res.status(500).send(err.message);
  }
};



// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send("Article not found");

    //  ownership check
    if (!article.authorId.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to edit this article");
    }

    res.render("articles/edit", { article });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching article for edit");
  }
};

// Update Article (U)
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send("Article not found");

    // ✅ ownership check
    if (!article.authorId.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to update this article");
    }

    // ✅ Update fields
    Object.assign(article, req.body);

    // ✅ If user uploaded a new image, replace
    if (req.file) {
      article.image = req.file.path;
    }

    await article.save();
    res.redirect("/articles/" + article._id);
  } catch (err) {
    res.status(400).send(err.message);
  }
};



// Delete Article (D)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send("Article not found");

    //  ownership check
    if (!article.authorId.equals(req.user._id)) {
      return res.status(403).send("You are not allowed to delete this article");
    }

    await article.deleteOne();
    res.redirect("/articles");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

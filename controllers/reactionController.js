
const Reaction = require("../models/Reaction");
const Article = require("../models/Article");

exports.toggleReaction = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { type } = req.body;        // "like" | "love" | "dislike"

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).send("Article not found");

    // check if user already reacted with the same type
    let reaction = await Reaction.findOne({
      user: req.user._id,
      article: articleId
    });

    if (reaction) {
      if (reaction.type === type) {
        // remove if clicking same again
        await Reaction.findByIdAndDelete(reaction._id);
        await Article.findByIdAndUpdate(articleId, { $pull: { reactions: reaction._id } });
      } else {
        // update type
        reaction.type = type;
        await reaction.save();
      }
    } else {
      // new reaction
      reaction = new Reaction({
        type,
        user: req.user._id,
        article: articleId
      });
      await reaction.save();
      article.reactions.push(reaction._id);
      await article.save();
    }

    res.redirect(`/articles/${articleId}#reactions`);
  } catch (err) {
    res.status(400).send("Error with reaction: " + err.message);
  }
};

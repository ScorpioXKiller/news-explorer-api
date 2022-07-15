const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const Article = require("../models/Article");

const sendData = (data, res) => res.status(200).send({ data });

const getAllArticles = (_req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (!articles) {
        throw new NotFoundError("No articles to display");
      }

      sendData(articles, res);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    data,
    source,
    link,
    image,
    owner = req.user._id,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    data,
    source,
    link,
    image,
    owner,
  })
    .then((article) => {
      if (!article) {
        throw new BadRequestError("Bad request");
      }

      sendData(article, res);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findByIdAndDelete(articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError("No article found with that id");
      }

      if (!article.owner._id.equals(req.user._id)) {
        throw new ForbiddenError(
          "Access to the requested resource is forbidden"
        );
      }

      sendData({ message: "card has been deleted successfully" }, res);
    })
    .catch((error) => {
      if (error.name === "Error") {
        res.status(403).send({ message: `${error.message}` });
      } else if (error.name === "CastError") {
        throw new BadRequestError("Bad request");
      }

      next(error);
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  createArticle,
  deleteArticle,
};

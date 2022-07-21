const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const Article = require("../models/Article");
const {
  emptyArticleList,
  badRequestMessage,
  articleNotFound,
  forbiddenAccess,
  articleDeleted,
  OK,
} = require("../utils/constants");

const sendData = (data, res) => res.status(OK).send({ data });

const getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (articles.length === 0) {
        throw new NotFoundError(emptyArticleList);
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
    date,
    source,
    link,
    image,
    owner = req.user._id,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => {
      if (!article) {
        throw new BadRequestError(badRequestMessage);
      }

      sendData(article, res);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .select("+owner")
    .then((article) => {
      if (!article) {
        throw new NotFoundError(articleNotFound);
      }

      if (!article.owner._id.equals(req.user._id)) {
        throw new ForbiddenError(forbiddenAccess);
      }

      Article.deleteOne({ _id: articleId }).then(() => {
        sendData({ message: articleDeleted }, res);
      });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        throw new BadRequestError(badRequestMessage);
      }

      next(error);
    })
    .catch(next);
};

module.exports = {
  getSavedArticles,
  createArticle,
  deleteArticle,
};

const articlesRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getSavedArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");
const auth = require("../middleware/auth");

const { validateUrl } = require("../middleware/urlValidator");

articlesRouter.get("/articles", auth, getSavedArticles);

articlesRouter.post(
  "/articles",
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(true),

    body: Joi.object()
      .keys({
        keyword: Joi.string().required(),
        title: Joi.string().required(),
        text: Joi.string().required(),
        date: Joi.string().required(),
        source: Joi.string().required(),
        link: Joi.string().required().custom(validateUrl),
        image: Joi.string().required().custom(validateUrl),
        user: Joi.object()
          .keys({
            _id: Joi.string().hex().required(),
          })
          .unknown(true),
      })
      .unknown(true),
  }),
  auth,
  createArticle
);

articlesRouter.delete(
  "/articles/:articleId",
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),

    body: Joi.object()
      .keys({
        user: Joi.object()
          .keys({
            _id: Joi.string().hex().required(),
          })
          .unknown(true),
      })
      .unknown(true),

    params: Joi.object()
      .keys({
        articleId: Joi.string().hex().required(),
      })
      .unknown(true),
  }),
  auth,
  deleteArticle
);

module.exports = articlesRouter;

const articlesRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getAllArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");

const { validateUrl } = require("../middleware/urlValidator");

articlesRouter.get("/", getAllArticles);

articlesRouter.post(
  "/",
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(true),

    body: Joi.object()
      .keys({
        keyword: Joi.string().required().min(1).max(10),
        title: Joi.string().required().min(2).max(30),
        text: Joi.string().required().min(2).max(200),
        source: Joi.string().required().min(2).max(30),
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
  createArticle
);

articlesRouter.delete(
  "/:articleId",
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
  deleteArticle
);

module.exports = articlesRouter;

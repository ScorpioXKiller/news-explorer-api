const usersRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getUserById } = require("../controllers/users");

usersRouter.get(
  "/me",
  celebrate({
    body: Joi.object()
      .keys({
        user: Joi.object()
          .keys({
            _id: Joi.string().hex().required(),
          })
          .unknown(true),
      })
      .unknown(true),
  }),
  getUserById
);

module.exports = usersRouter;

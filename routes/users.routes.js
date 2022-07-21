const usersRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getUserById, login, createUser } = require("../controllers/users");
const auth = require("../middleware/auth");

usersRouter.get(
  "/users/me",
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
  auth,
  getUserById
);

usersRouter.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

usersRouter.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(15).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

module.exports = usersRouter;

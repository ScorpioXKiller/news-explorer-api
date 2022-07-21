const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require("../models/User");
const {
  incorrectCredentials,
  badRequestMessage,
  userCreated,
  userNotFound,
  userExists,
  CREATED,
} = require("../utils/constants");

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 15)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError(badRequestMessage);
      }

      res.status(CREATED).send({ message: userCreated });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(incorrectCredentials);
      } else if (err.name === "MongoServerError") {
        throw new ConflictError(userExists);
      } else next(err);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError(userNotFound);
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserById,
  login,
};

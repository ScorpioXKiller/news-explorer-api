const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require("../models/User");

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "secret",
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
        throw new BadRequestError("Bad request");
      }

      res
        .status(201)
        .send({ message: "The user has been created successfully" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("The email and password are required");
      } else if (err.name === "MongoServerError") {
        throw new ConflictError("The user is already exists ");
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
        throw new NotFoundError("No user found with that id");
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUserById,
  login,
};

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const AuthenticationError = require("../errors/AuthenticationError");

dotenv.config();
const { NODE_ENV = "defaultValue", JWT_SECRET = "defaultValue" } = process.env;

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthenticationError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "secret"
    );
  } catch (error) {
    throw new AuthenticationError("Authorization required");
  }

  req.user = payload;
  next();
};
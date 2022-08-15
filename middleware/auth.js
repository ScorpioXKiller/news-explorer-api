const jwt = require("jsonwebtoken");

const AuthenticationError = require("../errors/AuthenticationError");
const { salt, authorizationRequired } = require("../utils/constants");

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthenticationError(authorizationRequired);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, salt);
  } catch (error) {
    throw new AuthenticationError(authorizationRequired);
  }

  req.user = payload;
  next();
};

const { NODE_ENV, SERVER_DB, JWT_SECRET } = process.env;

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER = 500;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const REQUEST_CONFLICT = 409;

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
  UNAUTHORIZED,
  FORBIDDEN,
  REQUEST_CONFLICT,
};

module.exports.MONGODB_DEV_URL =
  NODE_ENV === "production"
    ? SERVER_DB
    : "mongodb://localhost:27017/news-explorer";

module.exports.salt = NODE_ENV === "production" ? JWT_SECRET : "dev-secret";

module.exports.incorrectCredentials = "Incorrect user's email or password";
module.exports.badRequestMessage = "Bad request";
module.exports.userCreated = "The user has been created successfully";
module.exports.userExists = "The user is already exists";
module.exports.userNotFound = "No user found with that id";
module.exports.emptyArticleList = "No articles to display";
module.exports.articleNotFound = "No article found with that id";
module.exports.articleDeleted = "The article has been deleted successfully";
module.exports.forbiddenAccess =
  "Access to the requested resource is forbidden";
module.exports.authorizationRequired = "Authorization required";
module.exports.serverError = "An error has occurred on the server";

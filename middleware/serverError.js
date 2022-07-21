const { INTERNAL_SERVER, serverError } = require("../utils/constants");

module.exports.serverError = (err, _req, res, _next) => {
  const { statusCode = INTERNAL_SERVER, message } = err;

  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER ? serverError : message,
  });
};

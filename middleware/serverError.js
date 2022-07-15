module.exports.serverError = (err, _req, res, _next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });
};

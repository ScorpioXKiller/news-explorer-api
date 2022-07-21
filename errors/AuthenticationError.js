const { UNAUTHORIZED } = require("../utils/constants");

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = AuthenticationError;

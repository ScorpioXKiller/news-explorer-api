const { REQUEST_CONFLICT } = require("../utils/constants");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = REQUEST_CONFLICT;
  }
}

module.exports = ConflictError;

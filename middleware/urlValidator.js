const validator = require("validator").default;

module.exports.validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

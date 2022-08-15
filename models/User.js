const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator").default;

const AuthenticationError = require("../errors/AuthenticationError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: (props) => `${props.value} is not a valid email`,
    },
    required: [true, "User's email is required"],
    unique: true,
  },

  password: {
    type: String,
    validate: {
      validator: (password) => validator.isStrongPassword(password),
      message: (props) => `${props.value} is not a valid password`,
    },
    required: [true, "User's password is required"],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthenticationError("Incorrect email or password");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthenticationError("Incorrect email or password");
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);

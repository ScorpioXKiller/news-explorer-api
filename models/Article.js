const mongoose = require("mongoose");
const validator = require("validator").default;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 10,
  },

  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  text: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 200,
  },

  date: {
    type: String,
    required: true,
  },

  source: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  link: {
    type: String,
    validate: {
      validator: (articleURL) => validator.isURL(articleURL),
      message: (props) => `${props.value} is not a valid article link!`,
    },
    required: [true, "Article's link is required"],
  },

  image: {
    type: String,
    validate: {
      validator: (imageURL) => validator.isURL(imageURL),
      message: (props) => `${props.value} is not a valid article link!`,
    },
    required: [true, "Article's image link is required"],
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Article", articleSchema);

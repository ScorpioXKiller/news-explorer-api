const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors, celebrate, Joi } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
const users = require("./routes/users.routes");
const articles = require("./routes/articles.routes");
const auth = require("./middleware/auth");
const limiter = require("./middleware/limiter");
const { login, createUser } = require("./controllers/users");
const { serverError } = require("./middleware/serverError");
const NotFoundError = require("./errors/NotFoundError");

require("dotenv").config();

const { PORT = 3000 } = process.env;

const app = express();

async function start() {
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.options("*", cors());

  try {
    await mongoose.connect("mongodb://localhost:27017/newsdb");

    app.use(limiter);
    app.use(requestLogger);

    app.get("/crash-test", () => {
      setTimeout(() => {
        throw new Error("Server will crash now");
      }, 0);
    });

    app.post(
      "/signin",
      celebrate({
        body: Joi.object().keys({
          email: Joi.string().required().email(),
          password: Joi.string().required().min(8),
        }),
      }),
      login
    );

    app.post(
      "/signup",
      celebrate({
        body: Joi.object().keys({
          name: Joi.string().min(2).max(15).required(),
          email: Joi.string().required().email(),
          password: Joi.string().required().min(8),
        }),
      }),
      createUser
    );

    app.use("/users", auth, users);
    app.use("/articles", auth, articles);

    app.use("*", () => {
      throw new NotFoundError("Requested resource not found");
    });

    app.use(errorLogger);
    app.use(errors());
    app.use(serverError);

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

start();

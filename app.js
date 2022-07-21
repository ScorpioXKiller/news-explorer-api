const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
const limiter = require("./middleware/limiter");
const { serverError } = require("./middleware/serverError");
const NotFoundError = require("./errors/NotFoundError");
const mainRouter = require("./routes/main.routes");
const { MONGODB_DEV_URL } = require("./utils/constants");

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
    await mongoose.connect(MONGODB_DEV_URL);

    app.use(requestLogger);
    app.use(limiter);

    app.get("/crash-test", () => {
      setTimeout(() => {
        throw new Error("Server will crash now");
      }, 0);
    });

    app.use("/", mainRouter);

    app.use("*", () => {
      throw new NotFoundError("Requested resource not found");
    });

    app.use(errorLogger);
    app.use(errors());
    app.use(serverError);

    app.listen(PORT, () => {
      console.log(`App listening at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

const mainRouter = require("express").Router();
const articlesRouter = require("./articles.routes");
const usersRouter = require("./users.routes");

mainRouter.use(usersRouter, articlesRouter);

module.exports = mainRouter;

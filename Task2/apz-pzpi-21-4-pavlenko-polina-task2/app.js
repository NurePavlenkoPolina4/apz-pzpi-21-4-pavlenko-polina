const express = require("express");
const morgan = require("morgan");

const bookRouter = require("./routes/bookRouter");
const userRouter = require("./routes/userRouter");
const shelfRouter = require("./routes/shelfRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//1)GLOBAL MIDDLEWARES

//dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

//2) ROUTES
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shelf", shelfRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
//3)START THE SERVER
module.exports = app;

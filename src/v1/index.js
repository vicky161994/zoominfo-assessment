const express = require("express");
const logger = require("./utils/logger");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(require("morgan")("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/*", (req, res, next) => {
  if (!req.query) {
    res.status(404).send({
      message: "Not Found",
    });
  }
  next();
});
module.exports = app;

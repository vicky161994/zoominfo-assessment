const express = require("express");
const logger = require("./utils/logger");
const routes = require("./routes");
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

app.use("/users", routes.User);
app.use("/folders", routes.Folder);
// request to handle undefined or all other routes
app.get("*", (req, res) => {
  logger.info("users route");
  res.send(process.env.API_WORKS_MESSAGE);
});

module.exports = app;

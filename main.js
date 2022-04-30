const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const logger = require("./src/v1/utils/logger");
const health = require("./src/v1/utils/health");
const app = express();
const { errorHandler } = require("./src/v1/middleware/errorHandler");
const environment = process.env.ENVIRONMENT || process.env.ENVIRONMENT;
let envPath = "./environments/.env-dev";
if (environment === "test") {
  envPath = "./environments/.env-test";
} else if (environment === "production") {
  envPath = "./environments/.env-prod";
} else if (environment === "staging") {
  envPath = "./environments/.env-staging";
}
require("dotenv").config({ path: path.resolve(process.cwd(), envPath) });
const PORT = process.env.PORT || 5000;
const { verifyToken } = require("./src/v1/middleware/auth");
console.log("environment::::::", environment);
console.log("envPath::::::", envPath);
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan(":method :url :status :response-time ms - :res[content-length]")
  );
}
{
  app.use(
    morgan(
      '[:date[clf]] INFO ":method :url HTTP/:http-version" :remote-addr - :remote-user :status :res[content-length] :response-time ms  ":user-agent"'
    )
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: true, parameterLimit: 5000000 }));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use("/api/health-check", health.check);
app.use("/api/v1", require("./src/v1"));
if (environment !== "test") {
  app.listen(PORT, (err) => {
    if (err) {
      logger.error("Error::", err);
    }
    logger.info(`running server on from port:::::::${PORT}`);
  });
}
if (process.env.ENVIRONMENT !== "test") {
  require("./common/config/mongoose.service").connectWithRetry();
}

app.use(errorHandler);
module.exports = app;

const logger = require("./logger");

exports.check = (req, res) => {
  logger.info("user route");
  res.send(process.env.API_WORKS_MESSAGE);
};

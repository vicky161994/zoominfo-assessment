const { serverError, errorMessage } = require("./errorMessage");
const logger = require("../utils/logger");

const errorMessageObject = {
  message: errorMessage,
};

const serverErrorObject = {
  message: serverError,
};

exports.serverErrorResponse = (res) => {
  logger.info("constants::errorResponse::serverErrorResponse");
  return res.status(500).json(serverErrorObject);
};

exports.errorMessageResponse = (res) => {
  logger.info("constants::errorResponse::errorMessageResponse");
  return res.status(400).json(errorMessageObject);
};

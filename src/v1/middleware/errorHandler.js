const { serverError } = require("../constants/commonConstants");
const CustomErrorHandler = require("../error/customErrorHandler");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: serverError,
    ...((process.env.ENVIRONMENT === "development" ||
      process.env.ENVIRONMENT === "staging") && { originalError: err.message }),
  };

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(statusCode).json(data);
};

module.exports = {
  errorHandler,
};

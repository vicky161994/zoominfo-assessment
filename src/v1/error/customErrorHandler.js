class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static wrongInput(message = "Please provide correct input") {
    return new CustomErrorHandler(400, message);
  }

  static unAuthorized(message = "Not Authorized") {
    return new CustomErrorHandler(403, message);
  }
}

module.exports = CustomErrorHandler;

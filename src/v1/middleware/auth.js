const JWT = require("jsonwebtoken");
const {
  notAuthorizedMessage,
  serverError,
} = require("../constants/commonConstants");

function verifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (typeof token !== "undefined") {
      const bearer = token.split(" ");
      const bearerToken = bearer[1];
      JWT.verify(
        bearerToken,
        process.env.JWT_SECRET || "itssupersecret",
        (error, decode) => {
          if (error) {
            return res.status(403).send({
              message: notAuthorizedMessage,
            });
          }
          req.user = decode;
          next();
        }
      );
    } else {
      res.status(403).json({
        message: notAuthorizedMessage,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: serverError,
    });
  }
}

module.exports = {
  verifyToken,
};

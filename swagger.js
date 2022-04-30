const YAML = require("yamljs");
const swaggerDocumentV1 = YAML.load("./swagger-v1.yaml");

exports.v1 = (req, res, next) => {
  swaggerDocumentV1.host = req.get("host");
  req.swaggerDoc = swaggerDocumentV1;
  next();
};

const { userPopulateFields } = require("./commonConstants");

const userPopulate = {
  path: "createdBy",
  select: userPopulateFields,
};

module.exports = {
  userPopulate,
};

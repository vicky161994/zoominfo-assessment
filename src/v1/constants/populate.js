const {
  userPopulateFields,
  FolderPopulateFields,
} = require("./commonConstants");

const userPopulate = {
  path: "createdBy",
  select: userPopulateFields,
};
const FolderPopulate = {
  path: "folder",
  select: FolderPopulateFields,
};

module.exports = {
  userPopulate,
  FolderPopulate,
};

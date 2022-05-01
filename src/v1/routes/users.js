const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();
const { UserService } = require("../services");

router.post("/login", UserService.login);
router.post("/register", UserService.register);
router.get(
  "/dashboard",
  verifyToken,
  UserService.getFilesAndFolderForDashboard
);

module.exports = router;

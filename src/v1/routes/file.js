const express = require("express");
const router = express.Router();
const { FileService } = require("../services");
const { verifyToken } = require("../middleware/auth");

router.post("/create-file", verifyToken, FileService.createNewFile);
router.get(
  "/get-files-in-folder",
  verifyToken,
  FileService.getAllFilesOfFolder
);
router.get("/get-file-by-id/:fileId", verifyToken, FileService.getFileById);
router.put("/update-file/:fileId/", verifyToken, FileService.updateFile);
router.delete("/delete-file/:fileId/", verifyToken, FileService.deleteFile);

module.exports = router;

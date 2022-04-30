const express = require("express");
const router = express.Router();
const { FolderService } = require("../services");
const { verifyToken } = require("../middleware/auth");

router.post("/create-folder", verifyToken, FolderService.createNewFolder);
router.get("/get-all-folder", verifyToken, FolderService.getAllFolder);
router.get(
  "/get-folder-by-id/:folderId",
  verifyToken,
  FolderService.getFolderById
);
router.put("/update-folder/:folderId", verifyToken, FolderService.updateFolder);
router.delete(
  "/delete-folder/:folderId",
  verifyToken,
  FolderService.deleteFolder
);

module.exports = router;

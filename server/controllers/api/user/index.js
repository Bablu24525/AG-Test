 

"use strict";

const express = require("express"),
  userApiService = require("../../../services/api/user"),
  middleware = require("../../../middlewares");

let router = express.Router();

router.post("/upload", middleware.checkPermissions, middleware.fileUploader, userApiService.uploadFile);
router.get("/get_users", userApiService.getUsers);
router.get("/view/list_own_files", middleware.checkPermissions, userApiService.listOwnFiles);
router.get("/view/list_shared_files", middleware.checkPermissions, userApiService.listSharedFiles);
router.post("/share_file", userApiService.shareFileWithUser);
router.get("/delete/:fileId", middleware.checkPermissions, userApiService.deleteFile);

module.exports = router;

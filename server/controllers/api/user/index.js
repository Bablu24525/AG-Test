 

"use strict";

const express = require("express"),
  userApiService = require("../../../services/api/user"),
  userApiValidations = require("../../../requests/api/user"),
  { ValidateRequest } = require("../../../requests"),
  middleware = require("../../../middlewares");

let router = express.Router();

router.post("/upload", middleware.checkPermissions, middleware.fileUploader, userApiService.uploadFile);
router.get("/get_users", userApiService.getUsers);
router.get("/view/list_own_files", middleware.checkPermissions, userApiService.listOwnFiles);
router.post("/view/list_group_files", userApiValidations.ListGroupValidationRulesRequest(), ValidateRequest, middleware.checkPermissions, middleware.memberCheck , userApiService.getFilesForSpecificGroups);
router.get("/view/list_shared_files", middleware.checkPermissions, userApiService.listSharedFiles);
router.post("/share_file", userApiValidations.ShareFileValidationRulesRequest(), ValidateRequest, userApiService.shareFileWithUser);
router.post("/share_files_group", userApiValidations.ShareFileGroupValidationRulesRequest(), ValidateRequest, middleware.memberCheck, middleware.checkOwnerShip, userApiService.shareFilesWithGroup);
router.post("/create_group", userApiValidations.CreateGroupValidationRulesRequest(), ValidateRequest, userApiService.createGroup);
router.get("/list_group", userApiService.listGroups);
router.delete("/delete/:fileId", userApiValidations.DeleteFilePermissionValidationRulesRequest(),ValidateRequest,middleware.checkPermissions, userApiService.deleteFile);
router.get("/download/:fileId", middleware.checkPermissions, middleware.checkDownloadAccess, userApiService.download);
router.post("/change_file_permission", userApiValidations.ChangeFilePermissionValidationRulesRequest(), ValidateRequest, middleware.checkOwnerShipSingle, userApiService.changeFilePermission);

module.exports = router;

 

"use strict";

const express = require("express"),
  adminApiService = require("../../../services/api/admin"),
  adminApiValidations = require("../../../requests/api/admin"),
  { ValidateRequest } = require("../../../requests/index");


let router = express.Router();
router.get("/list_users", adminApiService.listUsers);
router.post("/change_user_permissions", adminApiValidations.ChangeUserPermissionValidationRulesRequest(), ValidateRequest, adminApiService.changeUserPermissions);


module.exports = router;

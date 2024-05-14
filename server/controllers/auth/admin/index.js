 

"use strict";

const express = require("express"),
  adminAuthService = require("../../../services/auth/admin"),
  { ValidateRequest } = require("../../../requests"),
  adminAuthValidations = require("../../../requests/admin/auth");

let router = express.Router();
/* ADMIN LOGIN */
router.post("/register", ValidateRequest, adminAuthValidations.RegistervalidationRulesRequest(), adminAuthService.adminRegister);
router.post("/login", ValidateRequest, adminAuthValidations.LoginvalidationRulesRequest(), adminAuthService.adminLogin);
// router.post("/forgot_password", adminAuthService.forgotPassword);
// router.post("/reset_password", adminAuthService.resetPassword);
// router.post("/reset_admin_password", adminAuthService.resetAdminPassword);
// router.post("/reset_user_password", adminAuthService.resetUserPassword);
// router.post("/register", adminAuthService.adminRegister);

module.exports = router;
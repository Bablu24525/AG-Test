 

"use strict";

const express = require("express"),
  userAuthService = require("../../../services/auth/user"),
  { ValidateRequest } = require("../../../requests"),
  userAuthValidations = require("../../../requests/user/auth");

let router = express.Router();
router.post("/register", ValidateRequest, userAuthValidations.RegistervalidationRulesRequest(), userAuthService.userRegister);
router.post("/login", ValidateRequest, userAuthValidations.LoginvalidationRulesRequest(), userAuthService.userLogin);

module.exports = router;

 

"use strict";

const express = require("express"),
  userAuthService = require("../../../services/auth/user"),
  { ValidateRequest } = require("../../../requests"),
  userAuthValidations = require("../../../requests/user/auth");

let router = express.Router();
router.post("/register", userAuthValidations.RegistervalidationRulesRequest(),ValidateRequest, userAuthService.userRegister);
router.post("/login", userAuthValidations.LoginvalidationRulesRequest(), ValidateRequest, userAuthService.userLogin);

module.exports = router;

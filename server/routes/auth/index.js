"use strict";

const express = require("express");
const adminAuthController = require("../../controllers/auth/admin");
const userAuthController = require("../../controllers/auth/user");
// const authController = require("../../controllers/auth/auth");

let router = express.Router();

router.use("/admin", adminAuthController);
router.use("/user", userAuthController);
// router.use("/", authController);

module.exports = router;

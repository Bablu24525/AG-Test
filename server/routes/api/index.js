"use strict";

const express = require("express");
const adminApiController = require("../../controllers/api/admin");
const Midelwares = require("../../middlewares");
// const userAuthController = require("../../controllers/auth/user");
// const authController = require("../../controllers/auth/auth");

let router = express.Router();

router.use("/admin", Midelwares.checkAuth, adminApiController);
// router.use("/user", userAuthController);
// router.use("/", authController);

module.exports = router;

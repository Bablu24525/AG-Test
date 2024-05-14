"use strict";

const express = require("express");
const adminApiController = require("../../controllers/api/admin");
const userApiController = require("../../controllers/api/user");
const Midelwares = require("../../middlewares");

let router = express.Router();

router.use("/admin", Midelwares.checkAdminAuth, adminApiController);
router.use("/user", Midelwares.checkUserAuth, userApiController);
// router.use("/", authController);

module.exports = router;

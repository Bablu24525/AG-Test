 

"use strict";

const express = require("express"),
  adminApiService = require("../../../services/api/admin");


let router = express.Router();
router.get("/list_users", adminApiService.listUsers);
router.post("/change_user_permissions", adminApiService.changeUserPermissions);


module.exports = router;

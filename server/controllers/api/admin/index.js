 

"use strict";

const express = require("express"),
  adminApiService = require("../../../services/api/admin");


let router = express.Router();
router.get("/test", adminApiService.test);


module.exports = router;

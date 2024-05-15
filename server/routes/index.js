 "use strict";
const apiController = require("./api"),
  authController = require("./auth"),
  bodyParser = require("body-parser");

function init(server) {
  // supporting every casing in query parameters
  server.use(function (req, res, next) {
    for (let key in req.query) {
      req.query[key.toLowerCase()] = req.query[key];
    }
    for (let key in req.body) {
      req.body[key.toLowerCase()] = req.body[key];
    }
    next();
  });

  // parse application/json
  server.use(bodyParser.json());

  server.use("/", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE ,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization"
    );
    next();
  });

  server.get("/", function (req, res) {
    res.send("<--- AG TEST SERVER --->");
  });

  server.use("/api", apiController);
  server.use("/auth", authController);
}

module.exports = {
  init: init,
};

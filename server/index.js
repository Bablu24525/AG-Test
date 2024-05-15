/**
 * @author Mateen Masood <mateensatti12@gmail.com>
 * @since 2021-02-22
 */

"use strict";
/**
 * Dependencies of This Application
 */

  const express = require("express"),
  bodyParser = require("body-parser"),
  routes = require("./routes"),
  colors = require("colors"),
  dotenv = require('dotenv'),
  mongooseInit = require("../server/data_access/index");

let server = express(),
  create,
  start;

create = function () {
  dotenv.config()
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use(express.static("public"));

  // Set up routes
  routes.init(server);
  // ================= SET UP ROUTES FOR WEB HOOKS

  // Initiating mongoose connection
  mongooseInit.initMongooseConnection().then((connected) => {
    if (connected) {
      console.log(
        colors.green(
          `Mongoose: connection to mongodb successful ✓`
        ),
        ":",
        colors.magenta(` Connection Date: ${new Date()} `)
      );
    } else {
      console.log(colors.red("Mongoose connection was unsuccessful"));
    }
  });
};

start = function () {
  server.listen(process.env.PORT, function () {
    console.log(
      `Starting ${process.env.DOMAIN_NAME} Backend Server at: ${process.env.PORT}`
    );
  });
};

module.exports = {
  create,
  start,
};


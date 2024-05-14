const mongoose = require("mongoose"),
  schemas = require("./schema");

module.exports = {
  User: mongoose.model("User", schemas.User),
  Admin: mongoose.model("Admin", schemas.Admin),
  UserSession: mongoose.model("UserSession", schemas.UserSession),
  AdminSession: mongoose.model("AdminSession", schemas.AdminSession),
  File: mongoose.model("File", schemas.File),
  Group: mongoose.model("Group", schemas.Group),
}
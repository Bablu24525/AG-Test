const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  file_permissions: {
    type: Array,
  },
});

const Admin = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
});

const AdminSession = new mongoose.Schema({
  session_hash: { type: String },
  admin_id: { type: mongoose.Schema.Types.ObjectId },
});

const UserSession = new mongoose.Schema({
  session_hash: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId },
});

const File = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  viewers: {
    type: Array,
    default: [],
  },
});

const Group = new mongoose.Schema({
  name: { type: String, required: true },
  members: { type: Array },
});

module.exports = {
  User,
  Admin,
  AdminSession,
  UserSession,
  File,
  Group,
}
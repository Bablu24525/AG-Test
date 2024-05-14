"use strict";

const mongoose = require("mongoose");

const _ = require("lodash"),
  md5 = require("md5"),
  jwt = require("jsonwebtoken"),
  Models = require("../../../data_access/models");


async function adminRegister(req, res){
    try {
        let {
            email,
            password
        } = req.body
        let obj = {
            email,
            password: md5(password)
        }
        let admin = await Models.Admin(obj).save()
        if(admin && admin._id){
            return res.status(200).json({
                success: true,
                message: "Admin registered successfully",
                data: admin
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Something went wrong while registering",
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while registering",
            error: error
        })
    }
}

async function adminLogin(req, res){
    try {
        let {
            email,
            password
        } = req.body
        let obj = {
            email,
            password: md5(password)
        }
        let admin = await Models.Admin.findOne(obj).select("-password")
        if(admin && admin._id){
            let hash = md5(new Date() + Math.random());
            let token = jwt.sign({ session_hash: hash }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await saveNewAdminSession(hash, admin._id)
            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                data: admin,
                token
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Something went wrong while logging in",
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while logging in",
            error: error
        })
    }
}

async function saveNewAdminSession(sessionHash, adminId) {
    try {
      let obj = {
        session_hash: sessionHash,
        admin_id: new mongoose.Types.ObjectId(adminId),
      };
      let response = await Models.AdminSession(obj).save();
      if (!response || !response._id) {
        throw "session not saved in db"
      }
    } catch (e) {
      console.log("Exception: ", e);
    }
}

module.exports = {
    adminRegister,
    adminLogin
}
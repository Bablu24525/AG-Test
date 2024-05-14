"use strict";

const mongoose = require("mongoose");

const _ = require("lodash"),
  md5 = require("md5"),
  jwt = require("jsonwebtoken"),
  Models = require("../../../data_access/models");


async function userRegister(req, res){
    try {
        let {
            email,
            password
        } = req.body
        let obj = {
            email,
            password: md5(password)
        }
        let user = await Models.User(obj).save()
        if(user && user._id){
            return res.status(200).json({
                success: true,
                message: "User registered successfully",
                data: user
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

async function userLogin(req, res){
    try {
        let {
            email,
            password
        } = req.body
        let obj = {
            email,
            password: md5(password)
        }
        let user = await Models.User.findOne(obj).select("-password")
        if(user && user._id){
            let hash = md5(new Date() + Math.random());
            let token = jwt.sign({ session_hash: hash }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await saveNewUserSession(hash, user._id)
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: user,
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

async function saveNewUserSession(sessionHash, userId) {
    try {
      let obj = {
        session_hash: sessionHash,
        user_id: new mongoose.Types.ObjectId(userId),
      };
      let response = await Models.UserSession(obj).save();
      if (!response || !response._id) {
        throw "session not saved in db"
      }
    } catch (e) {
      console.log("Exception: ", e);
    }
}

module.exports = {
    userRegister,
    userLogin
}
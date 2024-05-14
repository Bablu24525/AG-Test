"use strict";

const mongoose = require("mongoose");

const _ = require("lodash"),
  md5 = require("md5"),
  jwt = require("jsonwebtoken"),
  Models = require("../../../data_access/models");

async function test(req,res){
    try {
        console.log("test")
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while registering",
            error: error
        })
    }
}

module.exports = {
    test
}
"use strict";

const Models = require("../../../data_access/models");

async function listUsers(req,res){
    try {
        let users = await Models.User.find().select("-password");
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while retrieving users",
            error: error
        })
    }
}

async function changeUserPermissions(req,res){
    try {
        let {
            user_id,
            permissions
        } = req.body
        let user = await Models.User.findOneAndUpdate({ _id: user_id },{$set:{permissions:permissions}},{new:true});
        if(user && user._id){
            return res.status(200).json({
                success: true,
                message: "User permissions updated successfully",
                data: user
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Something went wrong while updating user permissions",
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while updating user permissions",
            error: error
        })
    }
}

module.exports = {
    listUsers,
    changeUserPermissions
}
"use strict";

const { default: mongoose } = require("mongoose");
const Models = require("../../../data_access/models");

async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        let file = req.file
        let obj = {
            name: file.originalname,
            path: file.path,
            owner: req.user_id
        }
        let savedFile = await Models.File(obj).save()
        if (savedFile && savedFile._id) {
            return res.status(200).json({
                success: true,
                message: "File uploaded successfully",
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Something went wrong while uploading",
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

async function listOwnFiles(req, res) {
    try {
        let files = await Models.File.find({ owner: req.user_id })
        return res.status(200).json({
            success: true,
            message: "Files fetched successfully",
            data: files
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while fetching files",
            error: error
        })
    }
}

async function getUsers(req, res) {
    try {
        let users = await Models.User.find({}).select("-password -file_permissions")
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while fetching users",
            error: error
        })
    }
}

async function deleteFile(req, res) {
    try {
        console.log(req.params.fileId)
        let file = await Models.File.findByIdAndDelete(req.params.fileId)
        console.log(file)
        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            data: file
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while deleting file",
            error: error
        })
    }
}

async function shareFileWithUser(req, res) {
    try {
        let {
            user_id,
            file_id,
            permission_level
        } = req.body
        let check_owner = await Models.File.findOne({ _id: file_id, owner: req.user_id })
        if (check_owner && check_owner._id) {
            let obj = {
                user_id: new mongoose.Types.ObjectId(user_id),
                permission: permission_level
            }
            let file = await Models.File.findOneAndUpdate({ _id: file_id }, { $push: { viewers: obj } }, { new: true })
            if (file && file._id) {
                return res.status(200).json({
                    success: true,
                    message: "File shared successfully",
                    data: file
                })
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong while sharing file",
                })
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "You are not the owner of this file",
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while sharing file",
            error: error
        })
    }
}

async function listSharedFiles(req, res) {
    try {
        let files = await Models.File.find({
            $or: [
                { viewers: { $elemMatch: { user_id: req.user_id } } },
                { is_public: true }
            ]
        })
        return res.status(200).json({
            success: true,
            message: "Files fetched successfully",
            data: files
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while sharing file",
            error: error
        })
    }
}

module.exports = {
    uploadFile,
    getUsers,
    listOwnFiles,
    deleteFile,
    shareFileWithUser,
    listSharedFiles
}
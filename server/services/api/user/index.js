"use strict";

const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const Models = require("../../../data_access/models");
const fs = require('fs');
const path = require('path');

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    let file = req.file;
    let obj = {
      name: file.originalname,
      path: file.path,
      owner: req.user_id,
    };
    let savedFile = await Models.File(obj).save();
    if (savedFile && savedFile._id) {
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while uploading",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while registering",
      error: error,
    });
  }
}

async function listOwnFiles(req, res) {
  try {
    let files = await Models.File.find({ owner: req.user_id });
    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      data: files,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching files",
      error: error,
    });
  }
}

async function getUsers(req, res) {
  try {
    let users = await Models.User.find({}).select(
      "-password -file_permissions"
    );
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching users",
      error: error,
    });
  }
}

async function deleteFile(req, res) {
  try {
    console.log(req.params.fileId);
    let file = await Models.File.findByIdAndDelete(req.params.fileId);
    console.log(file);
    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: file,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while deleting file",
      error: error,
    });
  }
}

async function shareFileWithUser(req, res) {
  try {
    let { user_id, file_id, permission_level } = req.body;
    let check_owner = await Models.File.findOne({
      _id: file_id,
      owner: req.user_id,
    });
    if (check_owner && check_owner._id) {
      let obj = {
        user_id: new mongoose.Types.ObjectId(user_id),
        permission: permission_level,
      };
      let file = await Models.File.findOneAndUpdate(
        { _id: file_id },
        { $push: { viewers: obj } },
        { new: true }
      );
      if (file && file._id) {
        return res.status(200).json({
          success: true,
          message: "File shared successfully",
          data: file,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Something went wrong while sharing file",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "You are not the owner of this file",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while sharing file",
      error: error,
    });
  }
}

async function listSharedFiles(req, res) {
  try {
    let files = await Models.File.find({
      $or: [
        { viewers: { $elemMatch: { user_id: req.user_id } } },
        { is_public: true },
      ],
    });
    let groups = await Models.Group.find({
      members: { $in: [req.user_id.toString()] },
    });
    let groupFileIdsSet = new Set(); // Use a Set to ensure uniqueness
    groups.forEach((group) => {
      // Concatenate file IDs from all groups
      group.files.forEach((fileId) => {
        groupFileIdsSet.add(fileId.toString()); // Convert to string to ensure consistency
      });
    });
    // Convert the Set to an array
    let group_file_ids = [...groupFileIdsSet];
    let group_files = await Models.File.find({
      _id: {
        $in: group_file_ids,
      },
    });
    let combinedFilesSet = new Set();

    files.forEach((file) => combinedFilesSet.add(JSON.stringify(file)));
    group_files.forEach((file) => combinedFilesSet.add(JSON.stringify(file)));

    // Convert the Set back to an array of file objects
    let combinedFiles = Array.from(combinedFilesSet).map((file) =>
      JSON.parse(file)
    );
    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      data: combinedFiles,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching files",
      error: error,
    });
  }
}

async function createGroup(req, res) {
  try {
    let { user_ids, name } = req.body;
    user_ids.push(req.user_id.toString());
    let obj = {
      members: user_ids,
      name,
    };
    let group = await Models.Group(obj).save();
    if (group && group._id) {
      return res.status(200).json({
        success: true,
        message: "Group created successfully",
        data: group,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while creating group",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while creating group",
      error: error,
    });
  }
}

async function shareFilesWithGroup(req, res) {
  try {
    let { group_id, file_ids } = req.body;
    let group = await Models.Group.findOneAndUpdate(
      { _id: group_id },
      { $push: { files: { $each: file_ids } } },
      { new: true }
    );
    if (group && group._id) {
      return res.status(200).json({
        success: true,
        message: "Files shared successfully",
        data: group,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while sharing file",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while sharing file",
      error: error,
    });
  }
}

async function getFilesForSpecificGroups(req, res) {
  try {
    let { group_id } = req.body;
    let group = await Models.Group.findOne({ _id: group_id });
    let files = await Models.File.find({
      _id: {
        $in: group.files,
      },
    });
    if (files && files.length) {
      return res.status(200).json({
        success: true,
        message: "Files fetched successfully",
        data: files,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while fetching Group",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching Groups",
      error: error,
    });
  }
}

async function listGroups(req, res) {
  try {
    let groups = await Models.Group.find({ members: { $in: [req.user_id.toString()] } });
      return res.status(200).json({
        success: true,
        message: "Groups fetched successfully",
        data: groups,
      })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching files",
      error: error,
    });
  }
}

async function download(req,res){
    try {
        const fileId = req.params.fileId;
        const file = await Models.File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        const filePath = path.join(__dirname, '../../../../', file.path);
        console.log(filePath)
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on the server' });
        }
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Something went wrong while downloading file",
            error: error,
        });
    }
}


async function changeFilePermission(req, res) {
  try {
    let { file_id, is_public } = req.body;
    let file = await Models.File.findOneAndUpdate(
      { _id: file_id },
      { $set: { is_public } },
      { new: true }
    );
    if (file && file._id) {
      return res.status(200).json({
        success: true,
        message: "File permissions updated successfully",
        data: file,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while updating file permissions",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong while updating file permissions",
      error: error,
    });
  }
}

module.exports = {
  uploadFile,
  getUsers,
  listOwnFiles,
  deleteFile,
  shareFileWithUser,
  listSharedFiles,
  createGroup,
  shareFilesWithGroup,
  getFilesForSpecificGroups,
  listGroups,
  download,
  changeFilePermission
};

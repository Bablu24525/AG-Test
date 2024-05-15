const Models = require('../data_access/models'),
    jwt = require('jsonwebtoken'),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path');

async function checkAdminAuth(req, res, next) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            let decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded) {
                let session = await Models.AdminSession.findOne({ session_hash: decoded.session_hash });
                if (session) {
                    req.admin_id = session.admin_id;
                    next();
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired. Please login again"
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again"
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: "Missing token with api request"
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

async function checkUserAuth(req, res, next) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            let decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded) {
                let session = await Models.UserSession.findOne({ session_hash: decoded.session_hash });
                if (session) {
                    let user_permissions = await Models.User.findOne({ _id: session.user_id }).select("permissions");
                    req.user_permissions = user_permissions.permissions;
                    req.user_id = session.user_id;
                    next();
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired. Please login again"
                    });
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again"
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: "Missing token with api request"
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

const createDestinationFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destFolder;
        if (file.mimetype.startsWith('image/')) {
            destFolder = 'uploads/images/';
        } else if (file.mimetype.startsWith('video/')) {
            destFolder = 'uploads/videos/';
        } else {
            destFolder = 'uploads/documents/';
        }
        createDestinationFolder(destFolder);
        cb(null, destFolder);
    },
    filename: function (req, file, cb) {
        const filenameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
        cb(null, filenameWithoutSpaces);
    }
});

// Multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100 }
}).single('file');

const fileUploader = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer error (e.g., file size limit exceeded)
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Other errors
            return res.status(500).json({ message: err.message });
        }
        next(); // Move to the next middleware
    });
};

const checkPermissions = (req, res, next) => {
    const permissions = req.user_permissions; // Assuming permissions are stored in req.user.permissions
    // Check if the user has the required permissions
    if (req.route.path.includes('/view') && !permissions.view) {
        return res.status(403).json({ message: 'You do not have permission to view files' });
    }
    if (req.route.path.includes('/upload') && !permissions.upload) {
        return res.status(403).json({ message: 'You do not have permission to upload files' });
    }
    if (req.route.path.includes('/delete') && !permissions.delete) {
        return res.status(403).json({ message: 'You do not have permission to delete files' });
    }
    if (req.route.path.includes('/download') && !permissions.download) {
        return res.status(403).json({ message: 'You do not have permission to download files' });
    }
    // If the user has the required permissions, proceed to the next middleware
    next();
};

const memberCheck = async (req,res,next) => {
    let group_id = req.body.group_id
    let user_id = req.user_id
    let group = await Models.Group.findOne({_id:group_id})
    if(group && group.members.includes(user_id)){
        next()
    }else{
        return res.status(400).json({
            success: false,
            message: "You are not a member of this group"
        })
    }
}

const checkOwnerShip = async (req,res,next) => {
    try {
        const fileIds = req.body.file_ids; // Assuming file_ids are passed in the request body

        // Check if file_ids array exists and is not empty
        if (!fileIds || fileIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No file IDs provided' });
        }

        // Iterate over each file ID and check ownership
        for (const fileId of fileIds) {
            const file = await Models.File.findById(fileId); // Assuming you have a File model

            // Check if the file exists
            if (!file) {
                return res.status(404).json({ success: false, message: `File with ID ${fileId} not found` });
            }

            // Check if the user owns the file
            if (!file.owner.equals(req.user_id)) {
                return res.status(403).json({ success: false, message: `User does not own file with ID ${fileId}` });
            }
        }

        // If all files are owned by the user, proceed to the next middleware
        next();
    } catch (error) {
        console.error('Error checking file ownership:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const checkOwnerShipSingle = async (req,res,next) => {
    try {
        const fileId = req.body.file_id;
        if (!fileId) {
            return res.status(400).json({ success: false, message: 'No file ID provided' });
        }
        let file = await Models.File.findOne({_id:fileId,owner:req.user_id})
        if (!file) {
            return res.status(404).json({ success: false, message: `You Dont have ownership of this file` });
        }
        next();
    } catch (error) {
        console.error('Error checking file ownership:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const checkDownloadAccess = async (req,res,next) => {
    try {
        let user_id = req.user_id
        let file_id = req.params.fileId
        let file = await Models.File.findById(file_id)
        let viewer = false
        let group_member = false
        for(const viewer of file.viewers){
            if(viewer.user_id.equals(user_id) && viewer.permissions.download === true){
                viewer = true
                return
            }
        }
        let groups = await Models.Group.find({files:{$in:[file_id]},viewers:{$in:[user_id]}})
        if(groups.length > 0){
            group_member = true
            return
        }
        if(file && file.owner.equals(user_id) || viewer === true || group_member === true || file.is_public === true){
            next()
        }
        else{
            return res.status(400).json({ success: false, message: "Not authorized to download this file "});
        }
    } catch (error) {
        console.error('Error checking file ownership:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    checkAdminAuth,
    checkUserAuth,
    fileUploader,
    checkPermissions,
    memberCheck,
    checkOwnerShip,
    checkDownloadAccess,
    checkOwnerShipSingle
}
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
        cb(null, file.originalname); // Use original filename
    }
});

// Multer upload instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
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
    if (req.route.path === '/upload' && !permissions.upload) {
        return res.status(403).json({ message: 'You do not have permission to upload files' });
    }
    if (req.route.path === '/delete' && !permissions.delete) {
        return res.status(403).json({ message: 'You do not have permission to delete files' });
    }
    // If the user has the required permissions, proceed to the next middleware
    next();
};

module.exports = {
    checkAdminAuth,
    checkUserAuth,
    fileUploader,
    checkPermissions
}
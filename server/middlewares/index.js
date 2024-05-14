const Models = require('../data_access/models'),
jwt = require('jsonwebtoken');

async function checkAuth(req, res, next) {
    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization;
            let decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded) {
                console.log("yes");
                let session = await Models.AdminSession.findOne({ session_hash: decoded.session_hash });
                if (session) {
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

module.exports = {
    checkAuth
}
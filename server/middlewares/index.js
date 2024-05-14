const Models = require('../../../data_access/models'),
jwt = require('jsonwebtoken');

async function checkAuth(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization;
        if (token) {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                let session = await Models.UserSession.findOne({ session_hash: decoded.session_hash });
                if (session) {
                    next();
                }
                else {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired. Please login again"
                    })
                }
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again"
                })
            }
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Missing token with api request"
            })
        }
    }
    else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
    }
}
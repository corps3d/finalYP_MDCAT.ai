const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next) => {
    if ( req.headers && req.headers.authorization ){
        const token = req.headers.authorization.split(' ')[1]

        try {

            const decode = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decode.userId);

            if (!user) 
                return res.json({ success: "Failure", message: "Unauthorized Access!"});

            req.user = user;
            
            next();

        } catch (e) {

            if( e.name === "JsonWebTokenError") {
                return res.json({ success: "Failure", message: "Unauthorized Access!"});
            }
            if( e.name === "TokenExpiredError") {
                return res.json({ success: "Failure", message: "Session Expired, Try Signing In!"});
            }
            
            return res.json({ success: "Failure", message: "Internal Server Error!"});
            
        }

    } else {
        res.json({ success: "Failure", message: "Unauthorized Access!"})
    }
}
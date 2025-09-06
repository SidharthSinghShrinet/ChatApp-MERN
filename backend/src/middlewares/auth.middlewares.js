const ErrorHandler = require("../utils/ErrorHandler.utils");
const userCollection = require('../models/user.models');
const jwt = require('jsonwebtoken');

const authenticate = async(req,res,next) => {
    const token = req.cookies.token;
    if(!token) throw new ErrorHandler("Please Login!");
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decodedToken);
    const {payload} = decodedToken;
    // console.log(payload);
    const user = await userCollection.findOne({_id:payload});
    if (!user) {
        throw new ErrorHandler("Invalid token, please login again", 401)
    }
    // console.log(user);
    req.user = user;
    next();
}

module.exports = authenticate;
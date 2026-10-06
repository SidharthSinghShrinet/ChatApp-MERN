const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler.utils");
const userCollection = require('../models/user.models');
const jwt = require('jsonwebtoken');

const authenticate = expressAsyncHandler(async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new ErrorHandler("Please Login!", 401);
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new ErrorHandler("Invalid or expired token, please login again", 401);
    }

    const { payload } = decodedToken;
    const user = await userCollection.findOne({ _id: payload });
    if (!user) {
        throw new ErrorHandler("Invalid token, please login again", 401);
    }

    req.user = user;
    next();
});

module.exports = authenticate;
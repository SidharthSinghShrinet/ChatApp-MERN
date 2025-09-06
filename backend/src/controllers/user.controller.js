const expressAsyncHandler = require('express-async-handler');
const userCollection = require('../models/user.models');
const ApiResponse = require('../utils/ApiResponse.utils');
const ErrorHandler = require('../utils/ErrorHandler.utils');
const generateJWTToken = require('../utils/jwt.utils');

const registerUser = expressAsyncHandler(async(req,res,next)=>{
    const {username,password,gender,fullname} = req.body;
    let maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`
    let femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`
    const newUser = await userCollection.create({
        username,
        fullname,
        password,
        profilePhoto:gender==="male"?maleProfilePhoto:femaleProfilePhoto,
        gender
    });
    new ApiResponse(201,true,"User registered successfully",newUser).send(res);
}) 

const loginUser = expressAsyncHandler(async(req,res,next)=>{
    let {username,password} = req.body;
    let existingUser = await userCollection.findOne({username:username});
    if(!existingUser) throw new ErrorHandler("User does not exists",404);
    // console.log(existingUser);
    let isMatch = await existingUser.comparePassword(password);
    // console.log(isMatch);
    if(!isMatch) throw new ErrorHandler("Invalid Credientials",400);
    let token = generateJWTToken(existingUser._id);
    // console.log(token);
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:1*60*60*1000
    })
    new ApiResponse(200,true,"User logged In Successfully",existingUser,token).send(res);
})

const logout = expressAsyncHandler(async(req,res,next)=>{
    res.clearCookie("token");
    new ApiResponse(200,true,"User logged Out Successfully").send(res);
})

const otherUsers = expressAsyncHandler(async(req,res,next)=>{
    let userId = req.user._id;
    // console.log(userId);
    let allUsers = await userCollection.find({
        _id:{$ne:userId}
    }).select("-password");
    // console.log(allUsers);
    if(allUsers.length===0) throw new ErrorHandler("Users not found",404);
    new ApiResponse(200,true,"All users fetched successfully",allUsers).send(res);
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    otherUsers
};
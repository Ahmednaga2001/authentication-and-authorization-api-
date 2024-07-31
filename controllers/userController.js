const asyncWrapper = require("../middlewares/asyncWrapper");
const bcrypt = require("bcryptjs")
const sharp = require("sharp");
const ApiError = require("../utils/ApiError");
const { v4: uuidv4 } = require('uuid');
const User = require("../models/user");
const { uploadSingleImg } = require("../middlewares/uploadImgMiddleware");


// upload single image
exports.uploadUserImg = uploadSingleImg("profileImg")
exports.resizeImg = asyncWrapper(async (req, res, next) => {
    const fileName = `user-${uuidv4()}-${Date.now()}`
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 98 })
    .toFile(`uploads/users/${fileName}.jpeg`)
    // save image into db
    req.body.profileImg = fileName
    next()
})

exports.creatUser = asyncWrapper(async (req, res, next) => {
    console.log(req.body);
    const user = await User.create(req.body)
    console.log("user" + user);
    return res.status(201).json({ data: user })
})

exports.getAllUsers = asyncWrapper(async (req, res, next) => {
    const page = +req.query.page || 1
    const limit = +req.query.limit || 10
    const skip = (page - 1) * limit
    const users = await User.find({}).skip(skip).limit(limit)
    if (!users) return next(new ApiError("No users found!"), 400)
    return res.status(200).json({ data: users, page, limit, length: users.length })
})

exports.getUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ApiError(`No user found for this id ${req.params.id}`), 404)
    return res.status(200).json({ data: user })
})

exports.updateUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profileImg: req.body.profileImg,
        role: req.body.role
    }, { new: true })
    if (!user) return next(new ApiError(`No user found for this id ${req.params.id}`), 404)
    return res.status(200).json({ data: user })
})
exports.changePassword = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt : Date.now()
    }, 
    { new: true })
    if (!user) return next(new ApiError(`No user found for this id ${req.params.id}`), 404)
    return res.status(200).json({ data: user })
})
exports.deleteUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return next(new ApiError(`No user found for this id ${req.params.id}`), 404)
    return res.status(200).json()
})


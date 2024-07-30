const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require('uuid');
const multer = require('multer')

// Disk Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/users')
    },
    filename: function (req, file, cb) {
        // user-${id}-Date.now()-extension
        const ext = file.mimetype.split("/")[1]
        const fileName = `user-${uuidv4()}-${Date.now()}.${ext}`
        cb(null, fileName)
    }
})
function fileFilter(req, file, cb) {

    if (file.mimetype.startsWith("image")) {
        cb(null, true)

    }
    else{
        cb(new ApiError("Only Images allowed", 400), false)

    }

}
const upload = multer({ storage: storage, fileFilter })
exports.uploadUserImg = upload.single('profileImg')
exports.creatUser = asyncWrapper(async (req, res, next) => {
    const user = await User.create(req.body)
    console.log(user);
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
        password: await bcrypt.hash(req.body.password, 12)
    }, { new: true })
    if (!user) return next(new ApiError(`No user found for this id ${req.params.id}`), 404)
    return res.status(200).json({ data: user })
})
exports.deleteUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return next(new ApiError(`No user found for this id ${req.params.id}`), 404)
    return res.status(200).json()
})


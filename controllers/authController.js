const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncWrapper = require("../middlewares/asyncWrapper")
const ApiError = require("../utils/ApiError")

const createToken = (payload)=>{
     return jwt.sign({userId:payload} , process.env.JWT_SECRET_KEY , {expiresIn:process.env.JWT_EXPIRE_TIME})
    
}
exports.signup = asyncWrapper(async(req,res , next)=>{

    const user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    })
    // const token = createToken(user._id)
    return res.status(201).json({data : user})
}) 
 

exports.login = asyncWrapper( async(req,res,next)=>{
    console.log(req.body);
    const user = await User.findOne({email : req.body.email})
    console.log(user);
    const isMatch = await bcrypt.compare(req.body.password,user.password)
    if(!user || !isMatch) return next(new ApiError("Incorrect Email or Password",401))
    const token =  createToken(user._id)
    res.cookie("access_token",`Bearer ${token}` , {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    return res.status(200).json({data : user})

})


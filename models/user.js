const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true,
        minlength : [6 , "To Short Password"]
    },
    passwordChangedAt : Date,
    role : {
        type : String,
        enum : ["admin" , "user"],
        default : "user"
    },
    phone : String,
    profileImg : String
},{timestamps:true})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
  })
const User = mongoose.model("User" , userSchema)
module.exports = User
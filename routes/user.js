const express = require("express")

const { createUserValidator, getUserValidator, deleteUserValidator, updateUserValidator, changeUserPasswordValidator } = require("../validators/userValidator")
const { creatUser, getAllUsers, getUser ,deleteUser, updateUser, changePassword, uploadUserImg } = require("../controllers/userController")

const router = express.Router()
router.route("/").post(uploadUserImg,createUserValidator,creatUser).get(getAllUsers)
router.route("/:id").get(getUserValidator,getUser).put(updateUserValidator,updateUser).delete(deleteUserValidator,deleteUser)
router.put("/changePassword/:id" ,changeUserPasswordValidator, changePassword)

module.exports = router
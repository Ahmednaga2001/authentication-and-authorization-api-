const express = require("express");

const {
  createUserValidator,
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
} = require("../validators/userValidator");
const {
  creatUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  changePassword,
  uploadUserImg,
  resizeImg,
} = require("../controllers/userController");
const { authentication, allowedTo } = require("../middlewares/authMiddleware");

const router = express.Router();
router
  .route("/")
  .post(
    authentication,
    allowedTo("admin"),
    uploadUserImg,
    resizeImg,
    createUserValidator,
    creatUser
  )
  .get(authentication , allowedTo("admin","manager") ,getAllUsers);
router
  .route("/:id")
  .get(authentication, allowedTo("admin"), getUserValidator, getUser)
  .put(
    authentication,
    allowedTo("admin"),
    uploadUserImg,
    resizeImg,
    updateUserValidator,
    updateUser
  )
  .delete(authentication , allowedTo("admin") ,deleteUserValidator, deleteUser);
router.put("/changePassword/:id", changeUserPasswordValidator, changePassword);

module.exports = router;

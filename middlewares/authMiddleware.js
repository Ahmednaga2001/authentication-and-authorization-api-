const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user");
const auth = async (req, res, next) => {
    try {
        let token;
        // 1) check if token exist
        if (req.cookies.access_token && req.cookies.access_token.startswith("Beare")) {
            token = req.cookies.access_token.split(" ")[1]
        }
        // 2) verfiy token(no changes happen or expired)
        if (!token) return next(new ApiError("You are not login , please login to access this route..."), 401)
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

        // check if user exist
        const currentUser = User.findById(decode.userId)
        if (!currentUser) return next(new ApiError("The user that is belong to this token does no longer exist"), 401)
        // check if user change password after token created
    req.user = currentUser,
    next()
    } catch (error) {

    }

}
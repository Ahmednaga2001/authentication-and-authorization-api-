const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user");
const asyncWrapper = require("./asyncWrapper");
exports.authentication = asyncWrapper(async (req, res, next) => {
  let token;
  // 1) check if token exist
  if (
    req.cookies.access_token &&
    req.cookies.access_token.startsWith("Bearer")
  ) {
    token = req.cookies.access_token.split(" ")[1];
    console.log(token);
  }
  // 2) verfiy token(no changes happen or expired)
  if (!token)
    return next(
      new ApiError("You are not login , please login to access this route..."),
      401
    );
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if user exist
  const currentUser = await User.findById(decode.userId);
  if (!currentUser)
    return next(
      new ApiError(
        "The user that is belong to this token does no longer exist"
      ),
      401
    );

  // check if user change password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt / 1000,
      10
    );
    console.log(passChangedTimestamp);
    if (passChangedTimestamp > decode.iat)
      return next(
        new ApiError(
          "User recently changed his password , please login again..."
        ),
        401
      );
  }
  req.user = currentUser;
  next();
})

//[("admin", "mangaer")];
// 1) access roles
// 2) access registered user(req.user)
exports.allowedTo = (...roles) => {
    console.log(roles);
  return asyncWrapper(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route"),
        403
      );
    }
    next();
  });
};

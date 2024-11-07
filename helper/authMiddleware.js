const CustomError = require("./CustomError");

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
      next();
  } else {
    next(
      new CustomError('Authorization', 'You are not authorized to view this page', 401)
    )
  }
}

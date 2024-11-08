const { Router } = require("express");
const indexController = require('../controllers/indexController');
const {validateUser, validateLogin} = require('../controllers/indexController');
const { isAuth } = require("../helper/authMiddleware");
const passport = require("passport");
const indexRouter = Router();

indexRouter.get('/', indexController.getIndexPage)
indexRouter.get('/sign-up', indexController.getSignUp)
indexRouter.get('/login', indexController.getLogin)
indexRouter.get('/change-role', isAuth, indexController.getBecomeMember)
indexRouter.get('/logout', indexController.getLogout)


indexRouter.post('/', validateUser, indexController.createUserPost)
indexRouter.post('/login', validateLogin, passport.authenticate("local", {
  failureRedirect: "/login",
  failureMessage: true,
  successRedirect: "/messages"
}))
indexRouter.post('/change-role', indexController.addMemberRole)

module.exports = indexRouter;
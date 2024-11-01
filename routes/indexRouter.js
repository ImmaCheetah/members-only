const { Router } = require("express");
const indexController = require('../controllers/indexController');
const {validateUser} = require('../controllers/indexController');
const passport = require("passport");
const indexRouter = Router();

indexRouter.get('/', indexController.getIndexPage)
indexRouter.get('/login', indexController.getLogin)
indexRouter.get('/become-member', indexController.getBecomeMember)
indexRouter.get('/logout', indexController.getLogout)


indexRouter.post('/', validateUser, indexController.createUserPost)
indexRouter.post('/login', passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/messages"
}))
indexRouter.post('/become-member', indexController.addMemberRole)

module.exports = indexRouter;
const { Router } = require("express");
const indexController = require('../controllers/indexController');
const {validateUser} = require('../controllers/indexController')
const indexRouter = Router();

indexRouter.get('/', indexController.getIndexPage)
indexRouter.get('/login', indexController.getLogin)
indexRouter.get('/become-member', indexController.getBecomeMember)

indexRouter.post('/', validateUser, indexController.createUserPost)

module.exports = indexRouter;
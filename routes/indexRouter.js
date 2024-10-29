const { Router } = require("express");
const indexController = require('../controllers/indexController');
const {validateUser} = require('../controllers/indexController')
const indexRouter = Router();

indexRouter.get('/', indexController.getIndexPage)

indexRouter.post('/', validateUser, indexController.createUserPost)

module.exports = indexRouter;
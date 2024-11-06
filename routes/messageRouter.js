const { Router } = require("express");
const messageController = require('../controllers/messageController');
const { isAuth } = require("../helper/authMiddleware");
const messageRouter = Router();

messageRouter.get('/', isAuth, messageController.getMessages)
messageRouter.get('/new-message', isAuth, messageController.getCreateMessage)

messageRouter.post('/delete/:messageId', messageController.postDeleteMessage)
messageRouter.post('/new-message', messageController.postCreateMessage)

module.exports = messageRouter;
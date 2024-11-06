const { Router } = require("express");
const messageController = require('../controllers/messageController');
const { isAuth } = require("../helper/authMiddleware");
const { validateMessage } = require('../controllers/messageController');
const messageRouter = Router();

messageRouter.get('/', isAuth, messageController.getMessages)
messageRouter.get('/new-message', isAuth, messageController.getCreateMessage)

messageRouter.post('/delete/:messageId', messageController.postDeleteMessage)
messageRouter.post('/new-message', validateMessage, messageController.postCreateMessage)

module.exports = messageRouter;
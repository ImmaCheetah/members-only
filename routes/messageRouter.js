const { Router } = require("express");
const messageController = require('../controllers/messageController');
const messageRouter = Router();

messageRouter.get('/', messageController.getMessages)
messageRouter.get('/new-message', messageController.getCreateMessage)

messageRouter.post('/new-message', messageController.postCreateMessage)

module.exports = messageRouter;
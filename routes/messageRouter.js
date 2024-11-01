const { Router } = require("express");
const messageController = require('../controllers/messageController');
const messageRouter = Router();

messageRouter.get('/', messageController.getMessages)

module.exports = messageRouter;
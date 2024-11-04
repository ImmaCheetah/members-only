const db = require('../db/queries');

async function getMessages(req, res, next) {
  try {
    const messages = await db.getAllMessages();
    // console.log('BODY', req.params)

    res.render('messages', { user: req.user, messages: messages });
  } catch (error) {
    console.log(error)
  }
}

function getCreateMessage(req, res, next) {
  res.render('createMessage');
}

async function postCreateMessage(req, res, next) {
  try {
    const {title, message} = req.body;
    const userId = req.user.user_id;

    await db.postMessage(title, message, userId)
    res.redirect('/messages');
  } catch (error) {
    console.log(error)
  }
}

async function postDeleteMessage(req, res, next) {
  try {
    const {messageId} = req.params;
    await db.deleteMessage(messageId);
    console.log('MESSAGE ID', req.params.messageId)
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  getMessages,
  getCreateMessage,
  postCreateMessage,
  postDeleteMessage
}
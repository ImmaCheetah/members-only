const db = require('../db/queries');

function getMessages(req, res, next) {
  res.render('messages', { user: req.user });
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


module.exports = {
  getMessages,
  getCreateMessage,
  postCreateMessage
}

function getMessages(req, res, next) {
  res.render('messages', { user: req.user });
}

function getCreateMessage(req, res, next) {
  res.render('createMessage');
}

module.exports = {
  getMessages,
  getCreateMessage
}
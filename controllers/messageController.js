
function getMessages(req, res, next) {
  res.render('messages', { user: req.user });
}

module.exports = {
  getMessages
}
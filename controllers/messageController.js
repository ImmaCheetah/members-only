const db = require('../db/queries');

const { body, validationResult } = require("express-validator");

const alphaErr = 'must contain only letters'
const titleLengthErr = 'must contain between 1 and 20 characters'
const msgLengthErr = 'must contain between 1 and 250 characters'

const validateMessage = [
  body('title')
    .trim()
    .matches(/^[A-Za-z ]+$/)
    .withMessage(`Title ${alphaErr}`)
    .isLength({min: 1, max: 20}).withMessage(`Title ${titleLengthErr}`),
  body('message')
    .trim()
    .isLength({min: 1, max: 250}).withMessage(`Message ${msgLengthErr}`),
]

async function getMessages(req, res, next) {
  try {
    const messages = await db.getAllMessages();
    // console.log('BODY', req.params)

    res.render('messages', { user: req.user, messages: messages });
  } catch (error) {
    next(new Error ('Could not get message page'))
  }
}

function getCreateMessage(req, res, next) {
  res.render('createMessage');
}

async function postCreateMessage(req, res, next) {
  try {
    const {title, message} = req.body;
    const userId = req.user.user_id;
    const errors = validationResult(req);

    // check for errors and render page 
    // with errors and name fields
    if (!errors.isEmpty()) {
      return res
      .status(400)
      .render('createMessage', {
          param: req.params,
          title: title,
          message: message,
          errors: errors.array()
      })
    }

    await db.postMessage(title, message, userId)
    res.redirect('/messages');
  } catch (error) {
    next(new Error ('Could not create message'))
  }
}

async function postDeleteMessage(req, res, next) {
  try {
    const {messageId} = req.params;
    await db.deleteMessage(messageId);
    res.redirect('/messages')
  } catch (error) {
    next(new Error ('Could not delete message'))
  }
}


module.exports = {
  getMessages,
  getCreateMessage,
  postCreateMessage,
  postDeleteMessage,
  validateMessage
}
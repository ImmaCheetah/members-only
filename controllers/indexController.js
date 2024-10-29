const db = require('../db/queries');

const { body, validationResult } = require("express-validator");

const alphaErr = 'must contain only letters'
const lengthErr = 'must contain between 1 and 30 characters'
const emailErr = 'must be in correct format'
const  passwordErr = 'must contain:'


const validateUser = [
    body('firstName').trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({min: 1, max: 30}).withMessage(`First name ${lengthErr}`),
    body('lastName').trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({min: 1, max: 30}).withMessage(`Last name ${lengthErr}`),
    body('email').trim()
    .isEmail().withMessage(`Email ${emailErr}`)
    .isLength({min: 1, max: 30})
    .custom(async value => {
        const user = await db.findUserByEmail(value);
        if (user) {
          throw new Error('E-mail already in use');
        }
    }),
    body('password').trim()
    .isStrongPassword().withMessage('Does not meet password requirements')
    .isLength({min: 1, max: 30}),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage(`Passwords don't match`),
    // body('').trim()
    // .isAlpha().withMessage()
    // .isLength({min: 1, max: 30}),
]

function getIndexPage(req, res, next) {
    res.render('sign-up')
}

async function createUserPost(req, res, next) {
    try {
        const {firstName, lastName, email, password} = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res
            .status(400)
            .render('sign-up', {
                param: req.params,
                title: 'Sign Up',  
                errors: errors.array()
            })
        }
        await db.createUser(firstName, lastName, email, password);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getIndexPage,
    createUserPost,
    validateUser,
}
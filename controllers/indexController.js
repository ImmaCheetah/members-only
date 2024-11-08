const db = require('../db/queries');
const bcrypt = require('bcryptjs');

const { body, validationResult } = require("express-validator");

const alphaErr = 'must contain only letters'
const lengthErr = 'must contain between 1 and 30 characters'
const emailErr = 'must be in correct format'

const validateUser = [
    body('firstName')
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({min: 1, max: 30}).withMessage(`First name ${lengthErr}`),
    body('lastName')
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({min: 1, max: 30})
    .withMessage(`Last name ${lengthErr}`),
    body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .isLength({min: 1, max: 30})
    .withMessage(`Email ${lengthErr}`)
    .custom(async value => {
        const user = await db.findUserByEmail(value);
        if (user) {
            throw new Error('E-mail already in use');
        }
    }),
    body('password')
    .trim()
    .isStrongPassword()
    .withMessage('Password needs: \n - 8 characters \n - 1 capital letter \n - 1 number \n - 1 special character')
    .isLength({min: 1, max: 30}),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage(`Passwords don't match`),
    // body('rolePassword').trim()
    // .isAlpha().withMessage()
    // .isLength({min: 1, max: 30}),
]

async function getIndexPage(req, res, next) {
    try {
        // const user = await db.findUserByEmail('john@gmail.com');
        // console.log(user)
        const messages = await db.getAllMessages();
        res.render('index', { user: req.user, messages: messages, title: 'Home' })
    } catch (error) {
        next(new Error ('Could not get home page'))
    }
}

function getLogin(req, res, next) {
    res.render('login', {failureMessage: req.session.messages, title: 'Login'})
}

function getSignUp(req, res, next) {
    res.render('sign-up', {title: 'Sign Up'})
}

function getLogout(req, res, next) {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
}

function getBecomeMember(req, res, next) {
    res.render('membership', {title: 'Change Role'})
}

async function addMemberRole(req, res, next) {
    try {
        const memberPassword = process.env.MEMBER_PWD;
        const adminPassword = process.env.ADMIN_PWD;  
    
        if (req.body.role === 'member' && req.body.rolePassword === memberPassword) {
            await db.updateRole(req.user.user_id, 'member');
            res.redirect('messages')
        } else if (req.body.role === 'admin' && req.body.rolePassword === adminPassword) {
            await db.updateRole(req.user.user_id, 'admin');
            res.redirect('messages')
        } else {
            console.log('wrong membership password')
            res.render('membership', {error: 'Wrong password'})
        }   
    } catch (error) {
        next(new Error ('Could not add role'))
    }
}

async function createUserPost(req, res, next) {
    try {
        const {firstName, lastName, email, password} = req.body;
        const errors = validationResult(req);

        // check for errors and render page 
        // with errors and name fields
        if (!errors.isEmpty()) {
            return res
            .status(400)
            .render('sign-up', {
                param: req.params,
                title: 'Sign Up',
                firstName: firstName,
                lastName: lastName,
                email: email,  
                errors: errors.array()
            })
        }

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            // if err, do something
            if (err) {
                console.log('error happened hashing')
            } else {
                // otherwise, store hashedPassword in DB
                await db.createUser(firstName, lastName, email, hashedPassword);
                console.log('password hashed');
            }
        });

        res.redirect('/login');
    } catch (error) {
        next(new Error ('Could not create user'))
    }

}

module.exports = {
    getIndexPage,
    getLogin,
    getSignUp,
    getLogout,
    getBecomeMember,
    addMemberRole,
    createUserPost,
    validateUser
}
const db = require('../db/queries');

function getIndexPage(req, res, next) {
    res.render('sign-up')
}

async function createUserPost(req, res, next) {
    try {
        const {firstName, lastName, email, password} = req.body;

        await db.createUser(firstName, lastName, email, password);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getIndexPage,
    createUserPost,
}
const pool = require('./pool');

async function createUser(firstName, lastName, email, password) {
    try {
        await pool.query(
            `INSERT INTO users(first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)`, [firstName, lastName, email, password]
        )
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createUser
}
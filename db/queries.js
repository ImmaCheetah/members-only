const pool = require('./pool');

async function createUser(firstName, lastName, email, password) {
    try {
        await pool.query(
            `INSERT INTO users(first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)`, [firstName, lastName, email, password]
        )
    } catch (error) {
        console.log(error)
    }
}

async function findUserByEmail(email) {
    const {rows} = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    )
    return rows;
}

module.exports = {
    createUser,
    findUserByEmail
}
const pool = require('./pool');

async function createUser(firstName, lastName, email, password) {
    try {
        await pool.query(
            `INSERT INTO users(first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)`, [firstName, lastName, email, password]
        )
    } catch (error) {
        console.log(error);
    }
}

async function findUserByEmail(email) {
    const {rows} = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    )
    return rows;
}

async function updateRoleToMember(userId) {
    try {
        await pool.query(
            `UPDATE users SET is_member = 't' WHERE user_id = $1`, [userId]
        )
    } catch (error) {
        console.log(error);
    }
}

async function postMessage(title, message, userIdFromUser) {
    try {
        // await pool.query('BEGIN')

        const messageId = await pool.query(
            `INSERT INTO messages (title, text) VALUES ($1, $2) RETURNING message_id`, [title, message]
        )
        console.log(messageId.rows[0].message_id)

        const userId = await pool.query(
            `SELECT user_id FROM users WHERE user_id = $1`, [userIdFromUser]
        )
        console.log(userId.rows[0].user_id)
        await pool.query(
            `INSERT INTO users_messages (user_id, message_id) VALUES ($1, $2)`, [userId.rows[0].user_id, messageId.rows[0].message_id]
        )

        // await pool.query('COMMIT')
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createUser,
    findUserByEmail,
    updateRoleToMember,
    postMessage
}
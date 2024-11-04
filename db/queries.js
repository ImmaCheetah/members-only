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

async function updateRole(userId, newRole) {
    try {
        await pool.query(
            `UPDATE users SET user_role = $1 WHERE user_id = $2`, [newRole, userId]
        )
    } catch (error) {
        console.log(error);
    }
}

async function getAllMessages() {
    try {
        const {rows} = await pool.query(
            `SELECT first_name, title, text, timestamp, user_role, messages.message_id FROM messages 
            JOIN users_messages ON messages.message_id = users_messages.message_id
            JOIN users ON users_messages.user_id = users.user_id`
        )
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function postMessage(title, message, userIdFromUser) {
    try {
        await pool.query('BEGIN')

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

        await pool.query('COMMIT')
    } catch (error) {
        console.log(error);
    }
}

async function deleteMessage(messageId) {
    try {
        await pool.query(
            `DELETE FROM messages WHERE message_id = $1`, [messageId]
        )
    } catch (error) {
        console.log(error);
    }    
}

module.exports = {
    createUser,
    findUserByEmail,
    updateRole,
    getAllMessages,
    postMessage,
    deleteMessage
}
const CustomError = require('../utils/CustomErrorHandler');
const db = require('./index')

const fetchUserByName = async (username) => {

        const result = await db.query('SELECT * FROM users WHERE username = $1', [username])
        const user = result.rows[0] || false;
    
        return user;
}

module.exports = {
    fetchUserByName
}
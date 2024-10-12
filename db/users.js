const { query } = require("./index");

const findByUsername = async (username) => {
  try {
    const result = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const findByUserId = async (user_id) => {
  try {
    const result = await query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    const user = result.rows[0];
    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  findByUsername,
  findByUserId
};

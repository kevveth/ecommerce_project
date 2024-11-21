const db = require("./index");

const exists = async (userId) => {
    const result = await db.query("SELECT 1 FROM users WHERE user_id = $1", [
      userId,
    ]);
    return result.rows[0] ? true : false;
};

const fetchUserByName = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  // const user = result.rows[0] || false;

  return result.rows[0];
};

const fetchUserById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [ id ])
  return result.rows[0];
}

const create = async (username, email, password) => {
  // Insert the new user into the database
  const result = await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
}

module.exports = {
  exists,
  fetchUserByName,
  fetchUserById,
  create
};

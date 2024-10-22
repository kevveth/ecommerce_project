const router = require("express").Router();
const db = {
  ...require("../db"),
  users: require("../Controllers/usersController"),
};

const table = "users";

// GET /users - Get all users
router.get("/", async (req, res) => {
  try {
    const result = await db.getAllData(table);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users.");
  }
});

// GET /users/:id - Get a specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
      userId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await db.users.findByUserId(userId);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found.")
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user.");
  }
});

// PUT /users/:id - Update an existing user
router.put("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email } = req.body; // You might want to handle password updates separately
    const result = await db.query(
      "UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *",
      [username, email, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found.");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user.");
  }
});

// DELETE /users/:id - Delete a user

module.exports = router;

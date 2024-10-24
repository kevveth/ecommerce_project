const router = require("express").Router();
const db = require("../db");
const UsersController = require("../Controllers/usersController");

const table = "users";

// GET /users - Get all users
router.get("/", UsersController.fetchAllUsers);

// GET /users/:id - Get a specific user by ID
router.get("/:id", UsersController.fetchUserById);

// PUT /users/:id - Update an existing user
router.put("/:id", );

// DELETE /users/:id - Delete a user

module.exports = router;

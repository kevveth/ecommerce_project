const router = require("express").Router();
const UsersController = require("../Controllers/usersController");

const table = "users";

// GET /users - Get all users
router.get("/", UsersController.fetchAllUsers);

// GET /users/:id - Get a specific user by ID
router.get("/:id", UsersController.fetchUserById);

// POST /users - Create a new user
router.post("/", UsersController.createNewUser);

// PUT /users/:id - Update an existing user
router.put("/:id", UsersController.updateUser);

// DELETE /users/:id - Delete a user
router.delete("/:id", UsersController.deleteUser);

module.exports = router;

const db = require("../db/index");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomErrorHandler");

// CREATE
const createNewUser = asyncErrorHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Insert the new user into the database
  const result = await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );

  res.status(201).json({
    status: "success",
    data: {
      user: result.rows[0]
    },
  });
});

// READ
const fetchAllUsers = asyncErrorHandler(async (req, res, next) => {
  const result = await db.query("SELECT * FROM users");
  const users = result.rows;

  res.status(200).json({
    status: "success",
    data: {
      users: users,
    },
  });
});

const fetchUserById = asyncErrorHandler(async (req, res, next) => {
  const userId = parseInt(req.params.id);

  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
    userId,
  ]);
  if (result.rowCount === 0) {
    const error = new CustomError("User not found.", 404);
    console.log(error)
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      user: result.rows[0],
    },
  });
});

// UPDATE
const updateUser = asyncErrorHandler(async (req, res, next) => {
  const userId = parseInt(req.params.id);
  const { username, email } = req.body; // You might want to handle password updates separately
  const result = await db.query(
    "UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *",
    [username, email, userId]
  );
  if (result.rowCount === 0) next(new CustomError("User not found.", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedUser: result.rows[0],
    },
  });
});

// DELETE
const deleteUser = asyncErrorHandler(async (req, res, next) => {
  // Extract the user ID from the request parameters and convert it to a number
  const userId = parseInt(req.params.id);

  // Execute the query to delete the user from the database
  const result = await db.query("DELETE FROM users WHERE user_id = $1", [
    userId,
  ]);

  // If no user was found with the given ID, throw a custom 404 error
  if (result.rowCount === 0) {
    const error = new CustomError("User not found.", 404);
    return next(error);
  }

  // Send a 204 No Content response to indicate successful deletion
  res.status(204).json({
    status: "success",
    data: {},
  });
});

module.exports = {
  createNewUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  deleteUser,
};

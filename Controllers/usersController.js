const db = require("../db/index");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomErrorHandler");

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
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      user: result.rows[0],
    },
  });
});

const updateUser = asyncErrorHandler(async (req, res, next) => {
  const userId = parseInt(req.params.id);
  const { username, email } = req.body; // You might want to handle password updates separately
  const result = await db.query(
    "UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *",
    [username, email, userId]
  );
  if (result.rowCount === 0) next(new CustomError("User not found.", 404))
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser: result.rows[0]
    }
  });
});

module.exports = {
  fetchAllUsers,
  fetchUserById,
  updateUser,
};

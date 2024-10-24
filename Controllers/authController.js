const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const UsersController = require("./usersController");
const bcrypt = require("bcrypt");

const register = asyncErrorHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    const error = new CustomError("Missing required fields", 400);
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  req.body.password = hashedPassword

  UsersController.createNewUser(req, res, next);
});

module.exports = {
  register,
};

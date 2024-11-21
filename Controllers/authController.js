const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const UsersController = require("./usersController");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/CustomErrorHandler");
const db = {
  ...require("../db/index"),
  users: require("../db/users"),
};
const passport = require("passport");
const initializePassport = require("../passport-config.js");

const register = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.headers)
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    const error = new CustomError("Missing required fields", 400);
    return next(error);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // req.body.password = hashedPassword

  const newUser = await db.users.create(username, email, hashedPassword);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

initializePassport(passport);

const login = [
  passport.authenticate("local"),
  (req, res) => {
    console.log(req.session.id);
    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        ...req.user,
      },
    });
  },
];

const logout = (req, res, next) => {
  const { user } = req;
  if (!user) {
    const err = new CustomError("No user to log out", 400);
    return next(err);
  } 

  req.logout((err) => {
    if (err) next(err)
    res.status(200).json({
      status: "success",
      message: "Logout successful"
    });
  });
}

module.exports = {
  register,
  login,
  logout
};

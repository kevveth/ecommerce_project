if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Logging Middleware
const morgan = require("morgan");
app.use(morgan("dev"));

// Body Parsing Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database and authentication setup
const db = require("./db");
const passport = require("passport");
const session = require("express-session");
const initializePassport = require("./passport-config.js");

// Initialize Passport
initializePassport(passport);

// Authentication Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Error Handling Middleware
const CustomError = require("./utils/CustomErrorHandler.js");
const globalErrorHandler = require("./Controllers/errorController.js");

// Routes
const usersRouter = require("./routes/usersRouter.js");
const productsRouter = require("./routes/productsRouter.js");
const ordersRouter = require("./routes/ordersRouter.js");
const cartsRouter = require("./routes/cartsRouter.js");

app.get("/", (req, res) => {
  res.send("Welcome to our simple online ecommerce web app!");
});

const AuthController = require("./Controllers/authController.js");
app.post("/register", AuthController.register);

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);

// Error Logging Middleware
app.use(globalErrorHandler);

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;

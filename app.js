if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const store = new session.MemoryStore();
const db = require("./db");
const passport = require("passport");
const port = process.env.PORT || 3001;

const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use(morgan("dev"));

// Authentication Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
      secure: false,
    },
    store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Error Handling Middleware
const globalErrorHandler = require("./Controllers/errorController.js");

// Routes
const authRouter = require("./routes/authRouter.js");
const usersRouter = require("./routes/usersRouter.js");
const productsRouter = require("./routes/productsRouter.js");
const ordersRouter = require("./routes/ordersRouter.js");
const cartsRouter = require("./routes/cartsRouter.js");

const AuthController = require("./Controllers/authController.js");
app.post("/register", AuthController.register);

app.get("/", (req, res) => {
  res.send({ msg: "Welcome to our simple online ecommerce web app!" });
});

app.get("/login", (req, res) => {
  res.json({ msg: "Login Page" });
});

app.post("/login", AuthController.login);

app.get("/logout", AuthController.logout);

app.use("/auth", authRouter);
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

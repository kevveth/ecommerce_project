if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const app = express();
  const port = process.env.PORT || 3001;
  
  // Database and authentication setup
  const db = require("./db");
  const passport = require("passport");
  const bcrypt = require("bcrypt");
  const session = require("express-session");
  const initializePassport = require("./passport-config.js");
  
  // Initialize Passport
  initializePassport(passport);
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Routes
  const usersRouter = require("./routes/usersRouter.js");
  const productsRouter = require("./routes/productsRouter.js");
  const ordersRouter = require("./routes/ordersRouter.js");
  const orderItemsRouter = require("./routes/orderItemsRouter.js");
  const cartsRouter = require("./routes/cartsRouter.js");
  const cartItemsRouter = require("./routes/cartItemsRouter.js");
  
  app.get("/", (request, response) => {
    response.send("Welcome to our simple online ecommerce web app!");
  });
  
  app.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      let saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const result = await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;",
        [username, email, hashedPassword]
      );
  
      console.log("New user registered:", result.rows[0]);
      res.redirect("login");
    } catch (err) {
      console.error(err);
      res.redirect("register");
    }
  });
  
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "login" }),
    (req, res) => {
      res.redirect("/");
    }
  );
  
  app.use("/users", usersRouter);
  app.use("/products", productsRouter);
  app.use("/orders", ordersRouter);
  app.use("/order_items", orderItemsRouter);
  app.use("/carts", cartsRouter);
  app.use("/cart_items", cartItemsRouter);
  
  // Start server
  if (require.main === module) {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
  
  module.exports = app;
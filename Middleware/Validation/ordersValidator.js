const { body, param, validationResult } = require("./validator");
const CustomError = require("../../utils/CustomErrorHandler");
const db = {
  ...require("../../db/index"),
  users: require("../../db/users"),
  carts: require("../../db/carts"),
};

const validateOrder = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Order ID must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.status(400).json({errors: errors.array()})
      const err = new CustomError("Validation Error", 400);
      err.errors = errors.array();
      return next(err);
    }
    next();
  },
];

const validateNewOrder = [
  body("user_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer")
    .custom(async (user_id) => {
      const userExists = await db.users.exists(user_id);
      if (!userExists) {
        throw new CustomError("Invalid ID, user does not exist", 400);
      }
    }),
  body("cart_id")
    .isInt({ min: 1 })
    .withMessage("Cart ID must be a positive integer")
    .custom(async (cart_id) => {
      const cartExists = await db.carts.exists(cart_id);
      if (!cartExists) {
        throw new CustomError("Invalid ID, cart does not exist", 400);
      }
    })
    .custom(async (cart_id, { req }) => {
      const user_id = req.body.user_id
      const cartResult = await db.query("SELECT * FROM carts WHERE cart_id = $1", [cart_id]);
      const cart = cartResult.rows[0];
      if(user_id !== cart.user_id) {
        throw new CustomError(`Cart with ID ${cart_id} does not belong to User with ID ${user_id}`, 400);
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.status(400).json({errors: errors.array()})
      const err = new CustomError("Validation Error", 400);
      err.errors = errors.array();
      return next(err);
    }
    next();
  },
];

module.exports = {
  validateOrder,
  validateNewOrder,
};

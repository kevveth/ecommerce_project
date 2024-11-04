const { body, param, validationResult } = require("express-validator");
const CustomError = require("../utils/CustomErrorHandler");
const db = {
  carts: require("../db/carts"),
  products: require("../db/products"),
  users: require("../db/users"),
};

const validateCartInput = [
  body("user_id")
    .exists()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer")
    .custom(async (user_id) => {
      const user = await db.users.exists(user_id);
      if (!user) {
        throw new CustomError("Invalid ID, user does not exist", 400);
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

const validateCartItemInput = [
  param("id")
    .exists()
    .withMessage("Cart ID is required")
    .isInt()
    .withMessage("Cart ID must be an integer")
    .custom(async (cart_id) => {
      const cartExists = await db.carts.fetchCartByCartId(cart_id);
      if (!cartExists) {
        throw new CustomError("Invalid ID, cart does not exist", 400);
      }
    }),
  body("product_id")
    .exists()
    .withMessage("Product ID is required")
    .isInt()
    .withMessage("Product ID must be an integer")
    .custom(async (product_id) => {
      const product = await db.products.fetchProductById(product_id);
      if (!product) {
        throw new CustomError("Invalid ID, product does not exist", 400);
      }
    }),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quanitity must be a positive integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

const validateProduct = [
  body("product_id")
    .exists()
    .withMessage("Product ID is required")
    .isInt()
    .withMessage("Product ID must be a positive integer")
    .custom(async (id) => {
      const product = await db.products.fetchProductById(id);
      if (!product) {
        throw new CustomError("Invalid ID, product does not exist.");
      }
    }),
  (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

// TODO:
const validateUpdate = [
  param("id")
    .exists()
    .withMessage("Cart ID is required")
    .isInt()
    .withMessage("Cart ID must be an integer")
    .custom(async (cart_id) => {
      const cart = await db.carts.fetchCartByCartId(cart_id);
      if (!cart) {
        throw new CustomError("Invalid ID, cart does not exist", 400);
      }
    }),
  body("product_id")
    .exists()
    .withMessage("Product ID is required")
    .isInt()
    .withMessage("Product ID must be an integer")
    .custom(async (product_id, { req }) => {
      const cart_id = req.params.id;
      const productExists = await db.carts.productExistsInCart(product_id);
      if (!productExists) {
        throw new CustomError("Invalid ID, product does not exist", 400);
      }
    }),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 404);
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

module.exports = {
  validateCartInput,
  validateCartItemInput,
  validateProduct,
  validateUpdate
};

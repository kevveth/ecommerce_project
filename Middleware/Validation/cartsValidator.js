const { body, param, validationResult } = require("express-validator");
const CustomError = require("../../utils/CustomErrorHandler");
const db = {
  ...require("../../db/index"),
  carts: require("../../db/carts"),
  products: require("../../db/products"),
  users: require("../../db/users"),
};

const validateCartId = [
  param("id")
    .exists()
    .withMessage("Cart ID is required")
    .isInt()
    .withMessage("Cart ID must be an integer")
    .custom(async (cart_id) => {
      const cartExists = await db.carts.fetchCartByCartId(cart_id);
      if (!cartExists) {
        throw new CustomError("Cart not found", 404);
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new CustomError("Validation Error", 400);
      err.errors = errors.array()
      return next(err)
    }

    next();
  }
]

const validateUserId = [
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

const validateProduct = [
  body("product_id")
    .exists()
    .withMessage("Product ID is required")
    .isInt()
    .withMessage("Product ID must be a positive integer")
    .custom(async (id) => {
      const product = await db.products.fetchProductById(id);
      if (!product) {
        throw new CustomError("Invalid ID, product does not exist");
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

const validateQuantity = [
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
]

const validateCartBelongsToUser = [
  param("id")
    .custom(async (cart_id, { req }) => {
      const cartResult = await db.query("SELECT * FROM carts WHERE cart_id = $1", [cart_id]);
      const cart = cartResult.rows[0];
      if(cart.user_id !== req.body.user_id) {
        throw new CustomError(`Cart with ID ${cart_id} does not belong to User with ID ${user_id}`);
      }
      
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
]

const validateCartHasItems = [
  param('id')
    .custom(async (cart_id) => {
      const cartItemsResult = await db.query("SELECT 1 FROM cart_items WHERE cart_id = $1", [cart_id]);
      if (cartItemsResult.rowCount === 0) { // Use rowCount to check for results
        throw new CustomError("Invalid, this cart is empty", 400); // Throw an error to trigger validation failure
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new CustomError("Validation Error", 400); // More generic error message
      err.errors = errors.array(); 
      return next(err);
    }

    next();
  }
];

module.exports = {
  validateCartId,
  validateUserId,
  validateProduct,
  validateQuantity,
  validateCartBelongsToUser,
  validateCartHasItems
};

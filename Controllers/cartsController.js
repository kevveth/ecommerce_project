const db = {
  ...require("../db/index"),
  carts: require("../db/carts.js"),
  users: require("../db/users.js"),
};
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomErrorHandler");

const getAllCarts = asyncErrorHandler(async (req, res, next) => {
  const result = await db.carts.fetchCarts();

  res.status(200).json({
    status: "success",
    data: {
      carts: result.rows,
    },
  });
});

const getCartByCartId = asyncErrorHandler(async (req, res, next) => {
  const cartId = parseInt(req.params.id);
  const cart = await db.carts.fetchCartByCartId(cartId);

  if (!cart) {
    const err = new CustomError("Cart not found.", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// Get all carts for a specific user
const getCartsByUserId = asyncErrorHandler(async (req, res, next) => {
  const userId = parseInt(req.params.id);
  const carts = await db.carts.fetchCartsByUserId(userId);

  if (carts.rowCount === 0) {
    const err = new CustomError("No carts found.", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    data: {
      carts,
    },
  });
});

// Get all items for a specific cart
const getCartItems = asyncErrorHandler(async (req, res, next) => {
  const cartId = req.params.id;
  const items = await db.carts.fetchCartItems(cartId);

  res.status(200).json({
    status: "success",
    data: {
      items,
    },
  });
});

// Create a new cart
const createNewCart = asyncErrorHandler(async (req, res, next) => {
  const { user_id } = req.body;

  // const validUser = await db.users.exists(user_id);
  // console.log(validUser);

  // if(!validUser) {
  //   const err = new CustomError("Invalid user ID. User does not exist.", 400);
  //   return next(err);
  // }
  const newCart = await db.carts.addNewCart(user_id);

  res.status(201).json({
    status: "success",
    data: {
      cart: newCart,
    },
  });
});

const addProductToCart = asyncErrorHandler(async (req, res, next) => {
  const cartId = req.params.id;
  const { product_id, quantity } = req.body;

  // Check if the cart exists
  const cartExists = await db.query("SELECT 1 FROM carts WHERE cart_id = $1", [
    cartId,
  ]);
  if (cartExists.rows.length === 0) {
    const err = new CustomError("Cart not found.", 404);
    return next(err);
  }

  // Check if the product exists
  const productExists = await db.query(
    "SELECT 1 FROM products WHERE product_id = $1",
    [product_id]
  );
  if (productExists.rows.length === 0) {
    const err = new CustomError("Product not found.", 404);
    return next(err);
  }

  const cartItem = await db.carts.addProduct(cartId, product_id, quantity);

  res.status(201).json({
    status: "success",
    data: {
      cartItem,
    },
  });
});

const updateCartItem = asyncErrorHandler(async (req, res, next) => {
  const cart_id = parseInt(req.params.id);
  const { product_id, quantity } = req.body;
  const updatedItem = await db.carts.updateProduct(cart_id, product_id, quantity);

  res.status(200).json({
    status: "success",
    data: {
      item: updatedItem
    }
  })
})

const removeProductFromCart = asyncErrorHandler(async (req, res, next) => {
  const cart_id = parseInt(req.params.id)
  const { product_id } = req.body;
  await db.carts.deleteProduct(cart_id, product_id);

  res.status(204).json({
    status: "success",
    data: {}
  })
})

module.exports = {
  getAllCarts,
  getCartByCartId,
  getCartsByUserId,
  createNewCart,
  addProductToCart,
  getCartItems,
  updateCartItem,
  removeProductFromCart
};

const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomErrorHandler");
const db = {
  ...require("../db/index"),
  orders: require("../db/orders"),
};

const getOrders = asyncErrorHandler(async (req, res, next) => {
  const result = await db.query("SELECT * FROM orders");

  res.status(200).json({
    status: "success",
    data: {
      orders: result.rows,
    },
  });
});

const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const order_id = parseInt(req.params.id);
  const result = await db.query("SELECT * FROM orders WHERE order_id = $1", [
    order_id,
  ]);

  if (result.rowCount === 0) {
    const err = new CustomError("Order not found", 404);
    return next(err);
  }

  res.status(200).json({
    status: "success",
    data: {
      order: result.rows[0],
    },
  });
});

const getOrderItems = asyncErrorHandler(async (req, res, next) => {
  const order_id = parseInt(req.params.id)
  const orderItemsResult = await db.query("SELECT * FROM order_items WHERE order_id = $1", [order_id]);

  const orderItems = orderItemsResult.rows;
  res.status(200).json({
    status: "success",
    data: {
      items: orderItems
    }
  })
})

const createOrder = asyncErrorHandler(async (req, res, next) => {
  const { user_id, cart_id } = req.body;

  // 1. Retrieve cart items
  const cartItemsResult = await db.query(
    "SELECT * FROM cart_items WHERE cart_id = $1",
    [cart_id]
  );
  if (cartItemsResult.rowCount === 0) {
    const err = new CustomError("Cart is empty", 400);
    return next(err);
  }

  const cartItems = cartItemsResult.rows;

  // 2. Calculate total amount
  let total_amount = 0;
  for (const item of cartItems) {
    const productResult = await db.query(
      "SELECT price FROM products WHERE product_id = $1",
      [item.product_id]
    );
    if (productResult.rowCount === 0) {
      const err = new CustomError(
        `Product with ID ${item.product_id} not found`,
        404
      );
      return next(err);
    }
    const product = productResult.rows[0];
    total_amount += product.price * item.quantity;
  }

  // 3. Create the order
  let orderResult = await db.query("INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *", [user_id, total_amount]);
  const order = orderResult.rows[0];

  // 4. Create the order items
  let orderItems = [];
  for (const item of cartItems) {
    const priceResult = await db.query("SELECT price FROM products WHERE product_id = $1", [item.product_id]);
    item.price = parseFloat(priceResult.rows[0])
    const orderItemResult = await db.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *", [order.order_id, item.product_id, item.quantity, item.price]);
    orderItems.push(orderItemResult.rows[0]);
  }

  res.status(201).json({
    status: "success",
    data: {
      order,
      orderItems
    }
  })
});

module.exports = {
  getOrders,
  getOrderById,
  getOrderItems,
  createOrder
};

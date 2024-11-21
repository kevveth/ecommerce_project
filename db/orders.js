const db = {
  ...require("../db/index"),
  carts: require("../db/carts"),
};
const CustomError = require("../utils/CustomErrorHandler");

const calculateTotal = async (cartItems) => {
  let total_amount = 0;
  for (const item of cartItems) {
    const productResult = await db.query(
      "SELECT price FROM products WHERE product_id = $1",
      [item.product_id]
    );
    // console.log(productResult.rows[0]);
    const price = productResult.rows[0].price;
    total_amount += price * item.quantity;
  }

  return total_amount;
};

const createOrderItems = async (order_id, cartItems) => {
  const orderItems = [];
  for (const item of cartItems) {
    const productResult = await db.query(
      "SELECT * FROM products WHERE product_id = $1",
      [item.product_id]
    );
    const product = productResult.rows[0];
    const newOrderItem = await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [order_id, item.product_id, item.quantity, product.price]
    );
    orderItems.push(newOrderItem);
  }

  return orderItems;
};

const createOrder = async (user_id, cart_id) => {
  // GET cart items
  const cartItems = await db.carts.fetchCartItems(cart_id);
  console.log(cartItems)

  // GET total amount
  const total_amount = await calculateTotal(cartItems);

  const orderResult = await db.query(
    "INSERT INTO orders (user_id, order_date, total_amount) VALUES ($1, $2, $3) RETURNING *",
    [user_id, new Date(), total_amount]
  );
  const order = orderResult.rows[0];

  // Create order items
  const orderItems = await createOrderItems(order.order_id, cartItems);

  return order;
};

module.exports = {
  createOrder,
};

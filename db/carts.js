const db = require("./index");

const exists = async (cart_id) => {
  const result = await db.query("SELECT 1 FROM carts WHERE cart_id = $1", [
    cart_id,
  ]);
  return result.rows[0] ? true : false;
};

const fetchCarts = async () => {
  const result = await db.query("SELECT * FROM carts");
  return result;
};

const fetchCartByCartId = async (cart_id) => {
  const result = await db.query("SELECT * FROM carts WHERE cart_id = $1", [
    cart_id,
  ]);
  return result.rows[0];
};

const fetchCartsByUserId = async (user_id) => {
  const result = await db.query("SELECT * FROM carts WHERE user_id = $1", [
    user_id,
  ]);
  return result.rows;
};

const addNewCart = async (user_id) => {
  const query = `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`;
  const result = await db.query(query, [user_id]);

  return result.rows[0];
};

const addProduct = async (cart_id, product_id, quantity) => {
  const result = await db.query(
    "INSERT INTO cart_items (cart_id, product_id, quantity)  VALUES ($1, $2, $3) RETURNING *",
    [cart_id, product_id, quantity]
  );
  return result.rows[0];
};

const fetchCartItems = async (cart_id) => {
  const result = await db.query("SELECT * FROM cart_items WHERE cart_id = $1", [
    cart_id,
  ]);
  return result.rows;
};

const updateProduct = async (cart_id, product_id, quantity) => {
  const result = await db.query(
    "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
    [quantity, cart_id, product_id]
  );
  return result.rows[0];
};

const deleteProduct = async (cart_id, product_id) => {
  await db.query(
    "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cart_id, product_id]
  );
};

const productExistsInCart = async (cart_id, product_id) => {
  const result = await db.query("SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cart_id, product_id])
  return result.rowCount > 0;
}

module.exports = {
  exists,
  fetchCarts,
  fetchCartByCartId,
  fetchCartsByUserId,
  addNewCart,
  addProduct,
  fetchCartItems,
  updateProduct,
  deleteProduct,
  productExistsInCart
};

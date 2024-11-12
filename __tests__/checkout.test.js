const request = require("supertest");
const app = require("../app");
const db = {
  ...require("../db/index"),
};

describe("Checkout Endpoint", () => {
  let server;
  let testUser;
  let testCart;

  beforeAll(async () => {
    server = app.listen();
    await db.pool.query("BEGIN");

    // Create a test user
    const userResult = await db.pool.query(
      "SELECT * FROM users WHERE user_id = $1", [1]
    );
    testUser = userResult.rows[0];

    // Create a test cart for the user
    const cartResult = await db.pool.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [testUser.user_id]
    );
    testCart = cartResult.rows[0];
  });

  afterAll(async () => {
    await db.pool.query("ROLLBACK");
    db.pool.end();
    server.close();
  });

  it("should successfully create an order on checkout", async () => {
    const res = await request(app)
      .post(`/carts/${testCart.cart_id}/checkout`)
      .send({ user_id: testUser.user_id })
      .expect(201);

    expect(res.body.status).toBe("success");
    expect(res.body.data.order).toBeDefined();
  });

  it("should return 404 for a non-existent cart", async () => {
    const invalidCartId = 99999;
    const res = await request(app)
      .post(`/carts/${invalidCartId}/checkout`)
      .send({ user_id: testUser.user_id })
      .expect(404);

    expect(res.body.message).toBe("Cart not found");
  });

  it("should return 400 for an empty cart", async () => {
    const testUserResult = await db.pool.query(
      "SELECT * FROM users WHERE username = $1",
      ["testuser"]
    );
    const testUser = testUserResult.rows[0];

    const emptyCartResult = await db.pool.query(
      "SELECT * FROM carts WHERE cart_id = $1",
      [273]
    );
    const emptyCart = emptyCartResult.rows[0];

    const res = await request(app)
      .post(`/carts/${emptyCart.cart_id}/checkout`)
      .send({ user_id: testUser.user_id })
      .expect(400);

    expect(res.body.message).toBe("Validation Error"); // Adjust the message if needed
    expect(res.body.error.errors[0].msg).toBe("Invalid, this cart is empty");
  });

  // Add more tests for invalid input, error conditions, etc.
});
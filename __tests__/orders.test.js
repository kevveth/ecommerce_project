const request = require("supertest");
const app = require("../app");
const db = {
  ...require("../db/index"),
};

describe("Order Endpoints", () => {
  let server;
  let testOrder = {};

  beforeAll(async () => {
    server = app.listen();
    await db.pool.query("BEGIN");

    const result = await db.pool.query(
      "INSERT INTO orders (user_id, order_date, total_amount) VALUES ($1, $2, $3) RETURNING *",
      [3, new Date(), 999]
    );
    testOrder = result.rows[0];
  });

  afterAll(async () => {
    await db.pool.query("ROLLBACK");
    db.pool.end();
    server.close();
  });

  describe("GET /orders", () => {
    it("should return all orders", async () => {
      const res = await request(app).get("/orders").expect(200);

      expect(res.body.data.orders).toBeDefined();
      expect(res.body.data.orders.length).toBeGreaterThanOrEqual(1); // Check if there's at least one order
    });

    it("should return a single order by ID", async () => {
      const res = await request(app)
        .get(`/orders/${testOrder.order_id}`)
        .expect(200);

      expect(res.body.data.order).toBeDefined();
      expect(res.body.data.order.order_id).toBe(testOrder.order_id); // Check if the correct order is returned
    });

    it("should return an order's items", async () => {
      const res = await request(app)
        .get(`/orders/${testOrder.order_id}/order_items`)
        .expect(200);
    });

    describe("Bad Requests", () => {
      it("should return 404 for an invalid order ID", async () => {
        const invalidOrderId = 99999; // Assuming this ID doesn't exist
        const res = await request(app)
          .get(`/orders/${invalidOrderId}`)
          .expect(404);

        //   expect(res.body.message).toBe("Order not found");
      });

      it("should return 400 for an invalid order ID format", async () => {
        const invalidOrderId = "abc";
        const res = await request(app)
          .get(`/orders/${invalidOrderId}`)
          .expect(400);

        expect(res.body.error.errors[0].msg).toBe(
          "Order ID must be a positive integer"
        );
      });
    });
  });

  describe("POST /orders", () => {
    it("should create a new order", async () => {
      const res = await request(app)
        .post("/orders")
        .send({
          user_id: testOrder.user_id,
          cart_id: 273,
        })
        // .expect(201);
        console.log(res.body.error)
    });

    describe("Bad Requests", () => {
      it("should return 400 if a cart does not belong to a user", async () => {
        const user_id = 2
        const cart_id = 1
        const res = await request(app)
        .post('/orders')
        .send({
          user_id,
          cart_id
        })
        .expect(400)

        expect(res.body.error.errors[0].msg).toBe(`Cart with ID ${cart_id} does not belong to User with ID ${user_id}`)
      })

      it("should return a 400 for an invalid user ID", async () => {
        const res = await request(app)
          .post("/orders")
          .send({
            user_id: "abc",
            cart_id: 1,
          })
          .expect(400);

        expect(res.body.error.errors[0].msg).toBe(
          "User ID must be a positive integer"
        );
      });

      it("should return a 400 for an invalid cart ID", async () => {
        const res = await request(app)
          .post("/orders")
          .send({
            user_id: testOrder.user_id,
            cart_id: "abc",
          })
          .expect(400);

        expect(res.body.error.errors[0].msg).toBe(
          "Cart ID must be a positive integer"
        );
      });

      it("should return a 400 for a nonexistent user", async () => {
        const res = await request(app)
          .post("/orders")
          .send({
            user_id: 999,
            cart_id: 1,
          })
          .expect(400);

        expect(res.body.error.errors[0].msg).toBe(
          "Invalid ID, user does not exist"
        );
      });

      it("should return a 400 for a nonexistent cart", async () => {
        const res = await request(app)
          .post("/orders")
          .send({
            user_id: testOrder.user_id,
            cart_id: 999,
          })
          .expect(400);

        expect(res.body.error.errors[0].msg).toBe(
          "Invalid ID, cart does not exist"
        );
      });

      it("should return a 400 for an empty cart", async () => {
        const testDummyResult = await db.pool.query(
          "SELECT * FROM users WHERE username = $1",
          ["testuser"]
        );
        const testDummy = testDummyResult.rows[0];
        const emptyCartResult = await db.pool.query(
          "SELECT * FROM carts WHERE user_id = $1",
          [testDummy.user_id]
        );
        const emptyCart = emptyCartResult.rows[0]
        console.log(emptyCart)
        const res = await request(app)
          .post("/orders")
          .send({
            user_id: parseInt(testDummy.user_id),
            cart_id: parseInt(emptyCart.cart_id),
          })
          .expect(400);

          console.log(res.body)
        expect(res.body.message).toBe("Cart is empty");
      });
    });
  });
});

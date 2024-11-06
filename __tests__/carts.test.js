const request = require("supertest");
const app = require("../app");
const db = {
  ...require("../db/index"),
  carts: require("../Controllers/cartsController"),
};

describe("Carts Endpoints", () => {
  let server;
  let userId; // To store the ID of the created user

  beforeAll(async () => {
    server = app.listen();
    await db.pool.query("BEGIN");
    // Create a user for testing
    const createUserResult = await db.pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id",
      ["testdummy", "testdummy@example.com", "hashedPassword"]
    );
    userId = createUserResult.rows[0].user_id;
  });

  afterAll(async () => {
    await db.pool.query("ROLLBACK");
    db.pool.end();
    server.close();
  });

  describe("GET /carts", () => {
    it("should return all the carts", async () => {
      const res = await request(app).get("/carts").expect(200);
    });

    it("should return a cart by passing in cart_id", async () => {
      const res = await request(app).get("/carts/1").expect(200);

      expect(res.body).toBeDefined();
    });

    it("should return a user's carts", async () => {
      const res = await request(app)
      .get("/carts/user/1")
      .expect(200);

      expect(res.body).toBeDefined();
    })
  });

  describe("POST /carts", () => {
    it("should create a new cart", async () => {
      const res = await request(app)
        .post("/carts")
        .send({ user_id: userId }) // Send the user ID in the request body
        .expect(201);

      expect(res.body.data.cart).toBeDefined(); // Check if the cart object is defined
      expect(res.body.data.cart.user_id).toBe(userId); // Check if the user ID is correct
    });

    it("should handle missing user_id", async () => {
      const res = await request(app)
      .post("/carts")
      .send({})
      .expect(400)
    });

    it("should handle invalid user_id", async () => {
      const res = await request(app)
        .post("/carts")
        .send({ user_id: 999 }) // Invalid user ID
        .expect(400);
        // console.log(res.body)


      // Check if the error message is correct
      expect(res.body.errors[0].msg).toBe("Invalid ID, user does not exist");
    });
  });

  describe("POST /carts/:cart_id/cart_items", () => {
    let cartId;

    // Before running these tests, create a cart to use
    beforeEach(async () => {
      const createCartRes = await request(app)
        .post("/carts")
        .send({ user_id: userId });
      cartId = createCartRes.body.data.cart.cart_id;
    });

    it("should add an item to the cart", async () => {
      const res = await request(app)
        .post(`/carts/${cartId}/cart_items`)
        .send({ product_id: 1, quantity: 2 })
        .expect(201);

      expect(res.body.data.cartItem).toBeDefined();
      expect(res.body.data.cartItem.cart_id).toBe(cartId);
      expect(res.body.data.cartItem.product_id).toBe(1);
      expect(res.body.data.cartItem.quantity).toBe(2);
    });

    it("should handle missing fields", async () => {
      const res = await request(app)
        .post(`/carts/${cartId}/cart_items`)
        .send({})
        .expect(400);

        expect(res.body.errors).toBeDefined()
    });

    it("should handle non-existent cart", async () => {
      const res = await request(app)
        .post("/carts/999/cart_items")
        .send({ product_id: 1, quantity: 2 })
        .expect(400);

        expect(res.body.errors[0].msg).toBe("Invalid ID, cart does not exist")
    });

    it("should handle non-existent product", async () => {
      const res = await request(app)
        .post(`/carts/${cartId}/cart_items`)
        .send({ product_id: 999, quantity: 2 })
        .expect(400);

        expect(res.body.errors[0].msg).toBe("Invalid ID, product does not exist")
    });

    it("should handle non-existent quantity", async () => {
      const res = await request(app)
      .post(`/carts/${cartId}/cart_items`)
      .send({ product_id: 1 })
      .expect(400)

      expect(res.body.errors[0].msg).toBe("Quantity is required")
    })
  });

  describe("PUT /carts/:cart_id/cart_items", () => {
    let cartId;

    // Before running these tests, create a cart to use
    beforeEach(async () => {
      const createCartRes = await request(app)
        .post("/carts")
        .send({ user_id: userId });
      cartId = createCartRes.body.data.cart.cart_id;
    });

    it("should update a cart item's quantity", async () => {
      const res = await request(app)
        .put(`/carts/${cartId}/cart_items`)
        .send({ product_id: 10, quantity: 5})
        .expect(404)
    })
  });
});
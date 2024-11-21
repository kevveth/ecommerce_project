// __tests__/users.test.js
const request = require("supertest");
const app = require("../app");
const { pool } = require("../db");
const bcrypt = require("bcrypt");

describe("User Endpoints", () => {
  let server;
  let userId; // To store the ID of the created user

  beforeAll(async () => {
    server = app.listen();
    await pool.query("BEGIN");

    // Create a user for testing
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    const createUserResult = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id",
      ["testdummy", "testdummy@example.com", hashedPassword]
    );
    userId = createUserResult.rows[0].user_id;
  });

  afterAll(async () => {
    await pool.query("ROLLBACK");
    pool.end();
    await server.close();
  });

  describe("GET /users", () => {
    it("should fetch all users", async () => {
      const res = await request(app).get("/users");

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users).toBeDefined(); // Check if the users array is defined
      expect(res.body.data.users.length).toBeGreaterThan(0); // Check if there are any users
    });
  });

  describe("GET /users/:id", () => {
    it("should fetch a specific user by ID", async () => {
      const res = await request(app).get(`/users/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.user_id).toBe(userId);
    });

    it("should return 404 for a non-existent user", async () => {
      const res = await request(app).get("/users/999");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("User not found.");
    });
  });

  describe("PUT /users/:id", () => {
    it("should update an existing user", async () => {
      const res = await request(app).put(`/users/${userId}`).send({
        username: "updateduser",
        email: "updateduser@example.com",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.updatedUser.username).toBe("updateduser");
      expect(res.body.data.updatedUser.email).toBe("updateduser@example.com");
    });

    it("should return 404 for a non-existent user", async () => {
      const res = await request(app).put("/users/999").send({
        username: "updateduser",
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("User not found.");
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete a user", async () => {
      const res = await request(app).delete(`/users/${userId}`);
      expect(res.statusCode).toBe(204); // Expect a 204 No Content response
    });

    it("should return 404 for a non-existent user", async () => {
      const res = await request(app).delete("/users/999");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toEqual("User not found.");
    });
  });
});

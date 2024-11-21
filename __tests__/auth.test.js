const request = require("supertest");
const app = require("../app");
const { pool } = require("../db");

describe("Authentication", () => {
  let server;
  const dummy = {
    username: "testdummy",
    email: "testdummy@example.com",
    password: "testpassword",
  };

  beforeAll(async () => {
    server = app.listen();
    await pool.query("BEGIN");
  });

  afterAll(async () => {
    await pool.query("ROLLBACK");
    pool.end();
    server.close();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/register").send({
        username: dummy.username,
        email: dummy.email,
        password: dummy.password,
      });
      console.log(res.user);
      expect(res.statusCode).toBe(201); // Expect a 201 Created response
      expect(res.body.data.user).toBeDefined(); // Check if the user object is defined
    });
  });

  describe("POST /login", () => {
    it("should not log in a user with invalid credentials", async () => {
      const res = await request(app).post("/login").send({
        username: dummy.username,
        password: "incorrectpassword",
      });

      expect(res.statusCode).toBe(401);
      // expect(res.headers.location).toBe("/login");
    });

    it("should log in a user with valid credentials", async () => {
      const res = await request(app).post("/login").send({
        username: dummy.username,
        password: dummy.password,
      });

      expect(res.statusCode).toBe(200);
      // expect(res.headers.location).toBe("/");
    });
  });
});

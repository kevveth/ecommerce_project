const request = require("supertest");
const app = require('../app');
const { pool } = require("../db");

describe("Authentication", () => {
  beforeAll(async () => {
    await pool.query("BEGIN");
  });

  afterAll(async () => {
    await pool.query("ROLLBACK");
    pool.end();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/register").send({
        username: "testdummy",
        email: "testdummy@example.com",
        password: "testpassword",
      });

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe("login");
    });
  });

  describe("POST /login", () => {
    it("should log in a user with valid credentials", async () => {
      const res = await request(app).post("/login").send({
        username: "testdummy",
        password: "testpassword",
      });

      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe("/");
    });
  });
});

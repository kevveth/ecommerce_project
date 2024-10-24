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
    it('should not log in a user with invalid credentials', async () => {
      // Send a POST request to /login with incorrect credentials
      const res = await request(app)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'incorrectpassword', // Use an incorrect password
        });

      // Check if the response has a 302 status code (redirect)
      expect(res.statusCode).toBe(302); 

      // Check if the redirect location is back to /login
      expect(res.headers.location).toBe('/login'); 
    });

    it("should log in a user with valid credentials", async () => {
      // Send a POST request to /login with correct credentials
      const res = await request(app).post("/login").send({
        username: "testdummy",
        password: "testpassword",
      });

      // Check if the response has a 302 status code (redirect)
      expect(res.statusCode).toBe(302);

      // Check if the user is redirected to the home page after successful login
      expect(res.headers.location).toBe("/");
    });
  });
});

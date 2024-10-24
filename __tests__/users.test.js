// __tests__/users.test.js
const request = require("supertest");
const app = require("../app");
const { pool, query } = require("../db");
const UsersController = require("../Controllers/usersController");

describe("User endpoints", () => {
  beforeAll(async () => {
    await query("BEGIN");
  });

  afterAll(async () => {
    await query("ROLLBACK");
    pool.end();
  });

  describe("GET /users", () => {
    it("should get all users", async () => {
      const res = await request(app)
        .get("/users")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("should get a user by their ID", async () => {
      const res = await request(app)
        .get("/users/1")
        .expect("Content-Type", /json/)
        .expect(200)

        expect(res.body.status).toEqual('success')
        console.log(res.body.data)
        expect(res.body.data).toBeDefined();
    });

    it("should throw a 404 error when a user is not found", async () => {
      const res = await request(app)
        .get("/users/999")
        .expect(404);

      expect(res.body.message).toEqual("User not found.")
    })
  });
});

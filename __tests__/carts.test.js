const request = require("supertest");
const app = require("../app");
const db = {
  ...require("../db/index"),
  carts: require("../Controllers/cartsController"),
};

describe("Carts Endpoints", () => {
    beforeAll(async () => {
        await db.pool.query("BEGIN");
      });
    
      afterAll(async () => {
        await db.pool.query("ROLLBACK");
        db.pool.end(); // Properly close the PostgreSQL connection pool
      });

      it("should return all the carts", async () => {
        const res = await request(app)
        .get("/carts")
        .expect(200)
      })
})
const request = require("supertest");
const app = require("../app");
const db = {
    ...require('../db/index')
}

describe("Order Endpoints", () => {
    let server;
    let testOrder = {};

    beforeAll(async () => {
        server = app.listen();
        await db.pool.query("BEGIN");

        const result = await db.pool.query("INSERT INTO orders (user_id, order_date, total_amount) VALUES ($1, $2, $3) RETURNING *", [3, new Date(), 999]);
        testOrder = result.rows[0];
    })

    afterAll(async () => {
        await db.pool.query("ROLLBACK");
        db.pool.end();
        server.close();
    })

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
    
        //   expect(res.body.errors[0].msg).toBe("Order ID must be a positive integer");
        });
      });
})
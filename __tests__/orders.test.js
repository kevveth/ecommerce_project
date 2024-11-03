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
        console.log(result.rows[0])
        testOrder = result.rows[0];
        console.log(testOrder)
    })

    afterAll(async () => {
        await db.pool.query("ROLLBACK");
        db.pool.end();
        server.close();
    })

    describe("GET /orders", () => {
        it("should return all the orders", async () => {
            const res = await request(app)
                .get('/orders')
                .expect(200);
            
            expect(res.body.data.orders).toBeDefined();
        })

        it("should return a single order", async () => {
            const res = await request(app)
                .get(`/orders/${testOrder.order_id}`)
                .expect(200);

            expect(res.body.data.order).toBeDefined();
        })
    })
})
const request = require("supertest");
const app = require("../app");
const db = {
  ...require("../db"),
  products: require("../Controllers/productsController"),
};

describe("Products Endpoints", () => {
  beforeAll(async () => {
    await db.pool.query("BEGIN");
  });

  afterAll(async () => {
    await db.pool.query("ROLLBACK");
    db.pool.end(); // Properly close the PostgreSQL connection pool
  });

  describe("GET /products", () => {
    it("should fetch all products", async () => {
      const res = await request(app)
        .get("/products")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("should filter products by category", async () => {
      const res = await request(app).get("/products?category=1");

      // console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(0); // There should be some products in the "Electronics" category
    });

    it("should fetch a product by its ID", async () => {
      const res = await request(app)
        .get('/products/1')
        .expect(200)

        expect(res.body.data.product).toHaveProperty('product_id');
    })
  });

  describe("POST /products", () => {
    it("should create a new product", async () => {
      const res = await request(app).post("/products").send({
        name: "New Product",
        description: "This is a new product",
        price: 100.0,
        image_url: "https://example.com/new-product.jpg",
        category_id: 1,
      });

      // console.log(res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.newProduct).toHaveProperty("product_id");
    });
  });

  describe("PUT /products/:id", () => {
    it("should update an existing product", async () => {
      const res = await request(app).put("/products/1").send({
        name: "Updated Product",
        description: "This is an updated product",
        price: 150.0,
      });
      
      console.log(res.body)
      expect(res.statusCode).toBe(200);
      expect(res.body.product_id).toBe(1);
      expect(res.body.name).toBe("Updated Product");
      expect(res.body.description).toBe("This is an updated product");
      expect(res.body.price).toEqual(150.0)
      expect(res.body.category_id).toBe(1);
    });

    it("should return 404 for a non-existent product", async () => {
      const res = await request(app).put("/products/999").send({
        name: "Updated Product",
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Product not found." });
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      // First, create a product to delete
      const createRes = await request(app).post('/products').send({
        name: 'Product to Delete',
        description: 'This product will be deleted',
        price: 50.00,
        image_url: 'https://example.com/delete-product.jpg',
        category_id: 1
      });
      expect(createRes.statusCode).toBe(201); 
      const productIdToDelete = createRes.body.data.newProduct.product_id;
  
      // Now, delete the product
      const res = await request(app).delete(`/products/${productIdToDelete}`);
      expect(res.statusCode).toBe(204); // Expect a 204 No Content response
    });
  
    it('should return 404 for a non-existent product', async () => {
      const res = await request(app).delete('/products/999');
      expect(res.statusCode).toBe(404);   
  
      expect(res.text).toBe('Product not found.');
    });
  });
});

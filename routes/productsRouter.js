const router = require("express").Router();
const db = {
  ...require("../db")
};

const ProductsController = require("../Controllers/productsController")

const table = "products";
// GET /products?category={categoryId} - Get all products, optionally filtered by category
router.get("/", ProductsController.getAllProducts);

// GET /products/:id - Get a product by its product_id
router.get('/:id', ProductsController.findProductById);

// POST /products - Create a new product
router.post("/", ProductsController.createNewProduct);

// PUT /products/{productId} - Update an existing product
router.put("/:id", async (req, res, next) => {
  const productId = parseInt(req.params.id);

  try {
    // Update properties of the existing product with values from the request body
    const updates = req.body;

    // Build the SET clause
    const updatedFields = Object.keys(updates);
    const setClause = updatedFields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const query = `UPDATE ${table} SET ${setClause} WHERE product_id = $${
      Object.keys(updates).length + 1
    } RETURNING *`;
    const values = [...Object.values(updates), productId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({
      ...result.rows[0],
      price: parseFloat(result.rows[0].price),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product.");
  }
});

// DELETE /products/{productId} - Delete a product
router.delete("/:id", async (req, res, next) => {
  const productId = parseInt(req.params.id);

  try {
    const result = await db.query(
      "DELETE FROM products WHERE product_id = $1",
      [productId]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Product not found.");
    }
    res.status(204).send(); // 204 No Content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});

module.exports = router;

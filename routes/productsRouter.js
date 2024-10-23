const router = require("express").Router();
const db = require("../db");

const ProductsController = require("../Controllers/productsController")

router.route('/')
  .get(ProductsController.getAllProducts)  // GET /products?category={categoryId} - Get all products, optionally filtered by category
  .post(ProductsController.createNewProduct);  // POST /products - Create a new product

router.route('/:id')
  .get(ProductsController.findProductById)  // GET /products/:id - Get a product by its product_id
  .put(ProductsController.updateProduct)  // PUT /products/{productId} - Update an existing product
  .delete(ProductsController.deleteProduct);  // DELETE /products/{productId} - Delete a product

module.exports = router;

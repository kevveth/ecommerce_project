const router = require("express").Router();
const ProductsController = require("../Controllers/productsController")

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products, optionally filtered by category.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Category ID to filter products by
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.route('/')
  .get(ProductsController.getAllProducts)
  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create a new product
   *     tags:
   *       - Products
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: Product created.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       400:
   *         description: Invalid input.
   */
  .post(ProductsController.createNewProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Returns the requested product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 */
  router.route('/:id')
  .get(ProductsController.findProductById)
  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product
   *     tags:
   *       - Products
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to update
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product updated.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       400:
   *         description: Invalid input.
   *       404:
   *         description: Product not found.
   */
  .put(ProductsController.updateProduct)
  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags:
   *       - Products
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to delete
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Product deleted.
   *       404:
   *         description: Product not found.
   */
  .delete(ProductsController.deleteProduct);

module.exports = router;
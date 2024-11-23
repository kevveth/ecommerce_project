const router = require("express").Router();
const {
  validateCartId,
  validateProduct,
  validateUserId,
  validateQuantity,
  validateCartBelongsToUser,
  validateCartHasItems,
} = require("../Middleware/Validation/cartsValidator");
const CartsController = require("../Controllers/cartsController");

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Get all carts
 *     tags:
 *       - Carts
 *     responses:
 *       200:
 *         description: Returns a list of all carts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */
router.get("/", CartsController.getAllCarts);

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     tags:
 *       - Carts
 *     requestBody:
 *       required: true
 *       description: User ID to associate with the new cart
 *     responses:
 *       201:
 *         description: Cart created.
 *       400:
 *         description: Invalid input.
 */
router.post("/", validateUserId, CartsController.createNewCart);

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     summary: Get cart by ID
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found.
 */
router.get("/:id", CartsController.getCartByCartId);

const validateCartItem = [validateCartId, validateProduct, validateQuantity];

/**
 * @swagger
 * /carts/{id}/items:
 *   get:
 *     summary: Get cart items by cart ID
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart to retrieve items from
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested cart items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart not found.
 */
router.get("/:id/items", CartsController.getCartItems);

/**
 * @swagger
 * /carts/{id}/items:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart to add the item to
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: Cart item data to add (product_id, quantity)
 *     responses:
 *       201:
 *         description: Cart item added.
 *       400:
 *         description: Invalid input.
 */
router.post("/:id/items", validateCartItem, CartsController.addProductToCart);

/**
 * @swagger
 * /carts/{id}/items:
 *   put:
 *     summary: Update cart item
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart to update the item in
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: Cart item data to update (product_id, quantity)
 *     responses:
 *       200:
 *         description: Cart item updated.
 *       400:
 *         description: Invalid input.
 */
router.put("/:id/items", validateCartItem, CartsController.updateCartItem);

/**
 * @swagger
 * /carts/{id}/items:
 *   delete:
 *     summary: Remove item from cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart to remove the item from
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: Product ID to remove from the cart
 *     responses:
 *       200:
 *         description: Cart item removed.
 *       400:
 *         description: Invalid input.
 */
router.delete(
  "/:id/items",
  validateProduct,
  CartsController.removeProductFromCart
);

/**
 * @swagger
 * /carts/user/{id}:
 *   get:
 *     summary: Get carts by user ID
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve carts for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested carts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       404:
 *         description: User not found.
 */
router.get("/user/:id", CartsController.getCartsByUserId);

const validateCheckout = [
  validateCartId,
  validateUserId,
  validateCartBelongsToUser,
  validateCartHasItems,
];

/**
 * @swagger
 * /carts/{id}/checkout:
 *   post:
 *     summary: Checkout a cart
 *     tags:
 *       - Carts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart to checkout
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: User ID for checkout
 *     responses:
 *       201:
 *         description: Cart checked out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Checkout' 
 *       400:
 *         description: Invalid input or cart does not belong to user.
 */
router.post("/:id/checkout", validateCheckout, CartsController.checkout);

module.exports = router;
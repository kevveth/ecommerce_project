const router = require("express").Router();
const OrdersController = require("../Controllers/ordersController");
const { validateOrder, validateNewOrder } = require("../Middleware/Validation/ordersValidator");

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Returns a list of all orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", OrdersController.getOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       description: User ID and Cart ID to create an order
 *     responses:
 *       201:
 *         description: Order created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input.
 */
router.post("/", validateNewOrder, OrdersController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found.
 */
router.get("/:id", validateOrder, OrdersController.getOrderById);

/**
 * @swagger
 * /orders/{id}/order_items:
 *   get:
 *     summary: Get order items by order ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve items from
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the requested order items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Order not found.
 */
router.get("/:id/order_items", validateOrder, OrdersController.getOrderItems);

module.exports = router;
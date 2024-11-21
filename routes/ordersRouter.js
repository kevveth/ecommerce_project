const router = require("express").Router();
const OrdersController = require("../Controllers/ordersController");
// const { param, validationResult } = require("express-validator");
const { validateOrder, validateNewOrder } = require("../Middleware/Validation/ordersValidator");

router
  .route("/")
  .get(OrdersController.getOrders)
  .post(validateNewOrder, OrdersController.createOrder);

router.get('/:id', validateOrder, OrdersController.getOrderById);
router.get('/:id/order_items', validateOrder, OrdersController.getOrderItems)


module.exports = router;

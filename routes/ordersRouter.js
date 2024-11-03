const router = require('express').Router();
const OrdersController = require('../Controllers/ordersController')

router.get('/', OrdersController.getOrders)

router.route('/:id')
    .get(OrdersController.getOrderById)

module.exports = router;
const router = require('express').Router();
const CartsRouter = require('../Controllers/cartsController')

router.get('/', CartsRouter.getAllCarts)

module.exports = router;
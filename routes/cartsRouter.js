const router = require("express").Router();
const {
  validateCartId,
  validateProduct,
  validateUserId,
  validateQuantity,
  validateCartBelongsToUser,
  validateCartHasItems
} = require("../Middleware/Validation/cartsValidator");
const CartsController = require("../Controllers/cartsController");

router
  .route("/")
  .get(CartsController.getAllCarts)
  .post(validateUserId, CartsController.createNewCart);

router.route("/:id").get(CartsController.getCartByCartId);

const validateCartItem = [validateCartId, validateProduct, validateQuantity];
router
  .route("/:id/items")
  .get(CartsController.getCartItems)
  .post(validateCartItem, CartsController.addProductToCart)
  .put(validateCartItem, CartsController.updateCartItem)
  .delete(validateProduct, CartsController.removeProductFromCart);

router.route("/user/:id").get(CartsController.getCartsByUserId);

const validateCheckout = [validateCartId, validateUserId, validateCartBelongsToUser, validateCartHasItems]
router.route('/:id/checkout')
  .post(validateCheckout, CartsController.checkout)

module.exports = router;

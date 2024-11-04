const router = require("express").Router();
const {
  validateCartInput,
  validateCartItemInput,
  validateProduct,
  validateUpdate
} = require("../Middleware/validation");
const CartsController = require("../Controllers/cartsController");

router
  .route("/")
  .get(CartsController.getAllCarts)
  .post(validateCartInput, CartsController.createNewCart);

router.route("/:id").get(CartsController.getCartByCartId);

router
  .route("/:id/cart_items")
  .get(CartsController.getCartItems)
  .post(validateCartItemInput, CartsController.addProductToCart)
  .put(validateUpdate, CartsController.updateCartItem)
  .delete(validateProduct, CartsController.removeProductFromCart);

router.route("/user/:id").get(CartsController.getCartsByUserId);

module.exports = router;

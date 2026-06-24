const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

router.use(authMiddleware);

router.get('/', CartController.getCart);
router.post('/', validate(CartController.addToCartSchema), CartController.addToCart);
router.put('/:id', validate(CartController.updateCartSchema), CartController.updateCartQuantity);
router.delete('/:id', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

module.exports = router;

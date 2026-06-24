const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

router.use(authMiddleware);

router.post('/', validate(OrderController.checkoutSchema), OrderController.checkout);
router.get('/my', OrderController.getMyOrders);
router.get('/', roleMiddleware('admin'), OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/status', roleMiddleware('admin'), validate(OrderController.updateStatusSchema), OrderController.updateOrderStatus);

module.exports = router;

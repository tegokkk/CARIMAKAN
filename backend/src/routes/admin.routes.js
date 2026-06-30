const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const rateLimit = require('../middlewares/rateLimit.middleware');

const adminRateLimit = rateLimit({
  windowMs: 60_000,
  max: 120,
  message: 'Terlalu banyak request admin. Coba lagi sebentar.',
});

router.use(adminRateLimit);

router.get('/stats', authMiddleware, roleMiddleware('admin'), AdminController.getStats);
router.get('/users', authMiddleware, roleMiddleware('admin'), AdminController.getUsers);
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), AdminController.updateUserRole);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), AdminController.deleteUser);
router.get('/orders', authMiddleware, roleMiddleware('admin'), OrderController.getAllOrders);
router.put('/orders/:id/status', authMiddleware, roleMiddleware('admin'), validate(OrderController.updateStatusSchema), OrderController.updateOrderStatus);

router.get('/merchants', authMiddleware, roleMiddleware('admin'), AdminController.getMerchants);
router.get('/restaurants', authMiddleware, roleMiddleware('admin'), AdminController.getRestaurants);
router.put('/restaurants/:id/status', authMiddleware, roleMiddleware('admin'), AdminController.updateRestaurantStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const MerchantController = require('../controllers/merchant.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Protect all merchant routes
router.use(authMiddleware, roleMiddleware('merchant', 'admin'));

router.get('/dashboard', MerchantController.getDashboard);

router.get('/restaurants', MerchantController.getRestaurants);
router.post('/restaurants', MerchantController.createRestaurant);
router.put('/restaurants/:id', MerchantController.updateRestaurant);

router.get('/menus', MerchantController.getMenus);
router.post('/menus', MerchantController.createMenu);
router.put('/menus/:id', MerchantController.updateMenu);
router.delete('/menus/:id', MerchantController.deleteMenu);

router.get('/orders', MerchantController.getOrders);
router.put('/orders/:id/status', MerchantController.updateOrderStatus);

module.exports = router;

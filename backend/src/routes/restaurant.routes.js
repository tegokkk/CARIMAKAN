const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/restaurant.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', RestaurantController.getRestaurants);
router.get('/:id', RestaurantController.getRestaurantById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  upload.single('image'),
  validate(RestaurantController.restaurantSchema),
  RestaurantController.createRestaurant
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  upload.single('image'),
  validate(RestaurantController.restaurantSchema),
  RestaurantController.updateRestaurant
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  RestaurantController.deleteRestaurant
);

module.exports = router;

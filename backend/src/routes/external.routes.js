const express = require('express');
const router = express.Router();
const ExternalController = require('../controllers/external.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

router.get('/meals/search', ExternalController.searchMeals);
router.get('/meals/:id', ExternalController.getMealDetail);
router.post(
  '/meals/import/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validate(ExternalController.importMealSchema),
  ExternalController.importMeal
);

module.exports = router;

const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');

router.get('/', CategoryController.getCategories);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  validate(CategoryController.categorySchema),
  CategoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validate(CategoryController.categorySchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  CategoryController.deleteCategory
);

module.exports = router;

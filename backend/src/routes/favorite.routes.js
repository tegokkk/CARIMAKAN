const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', FavoriteController.getFavorites);
router.post('/:menuId', FavoriteController.addFavorite);
router.delete('/:menuId', FavoriteController.removeFavorite);

module.exports = router;

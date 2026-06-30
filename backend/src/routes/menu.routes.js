const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menu.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', MenuController.getMenus);
router.get('/stats', MenuController.getStats);
router.get('/recommended', MenuController.getRecommended);
router.get('/:id', MenuController.getMenuById);

module.exports = router;

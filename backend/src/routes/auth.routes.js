const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const rateLimit = require('../middlewares/rateLimit.middleware');

const authRateLimit = rateLimit({
  windowMs: 60_000,
  max: 8,
  message: 'Terlalu banyak percobaan login/register. Coba lagi sebentar.',
});

router.post('/register', authRateLimit, validate(AuthController.registerSchema), AuthController.register);
router.post('/login', authRateLimit, validate(AuthController.loginSchema), AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;

const AuthService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

class AuthController {
  static get registerSchema() {
    return registerSchema;
  }

  static get loginSchema() {
    return loginSchema;
  }

  static async register(req, res, next) {
    try {
      const userData = await AuthService.register(req.body);
      return sendSuccess(res, 'User registered successfully', userData, null, 201);
    } catch (error) {
      if (error.message === 'Email already registered') {
        return sendError(res, error.message, [], 400);
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const data = await AuthService.login(req.body);
      return sendSuccess(res, 'User logged in successfully', data);
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return sendError(res, error.message, [], 401);
      }
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      return sendSuccess(res, 'User profile fetched successfully', req.user);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      return sendSuccess(res, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

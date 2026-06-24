const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { sendError } = require('../utils/response');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, token missing', [], 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'carimakan_secret_key');

    // Get user from db
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'Not authorized, user not found', [], 401);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendError(res, 'Not authorized, token invalid or expired', [], 401);
  }
};

module.exports = authMiddleware;

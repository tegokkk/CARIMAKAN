const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const generateToken = require('../utils/generateToken');

class AuthService {
  static async register({ name, email, password, phone }) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'user',
      },
    });

    return {
      id: user.id,
      name,
      email,
      phone,
      role: 'user'
    };
  }

  static async login({ email, password }) {
    // Get user from DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      },
      token
    };
  }
}

module.exports = AuthService;

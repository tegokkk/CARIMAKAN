const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const addToCartSchema = z.object({
  body: z.object({
    menu_id: z.number().int().positive('Menu ID is required'),
    quantity: z.number().int().positive('Quantity must be at least 1').optional().default(1)
  })
});

const updateCartSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('Quantity must be at least 1')
  })
});

const mapCartItem = (item) => ({
  id: item.id,
  user_id: item.userId,
  menu_id: item.menuId,
  quantity: item.quantity,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
  name: item.menu?.name,
  price: Number(item.menu?.price || 0),
  image: item.menu?.image,
  stock: item.menu?.stock,
  restaurant_name: item.menu?.restaurant?.name,
});

const cartInclude = {
  menu: {
    include: {
      restaurant: true,
    },
  },
};

class CartController {
  static get addToCartSchema() {
    return addToCartSchema;
  }

  static get updateCartSchema() {
    return updateCartSchema;
  }

  static async getCart(req, res, next) {
    try {
      const userId = req.user.id;

      const cartItems = await prisma.cart.findMany({
        where: { userId },
        include: cartInclude,
        orderBy: { id: 'asc' },
      });

      return sendSuccess(res, 'Cart items fetched successfully', cartItems.map(mapCartItem));
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { menu_id, quantity } = req.body;

      // Check if menu exists and is active
      const menu = await prisma.menu.findUnique({ where: { id: menu_id } });
      if (!menu || !menu.isActive) {
        return sendError(res, 'Menu item not found or unavailable', [], 404);
      }

      // Check stock
      if (menu.stock < quantity) {
        return sendError(res, `Insufficient stock. Only ${menu.stock} items left`, [], 400);
      }

      // Check if item is already in user's cart
      const existing = await prisma.cart.findFirst({
        where: { userId, menuId: menu_id },
      });

      if (existing) {
        const newQuantity = existing.quantity + quantity;

        // Verify stock for updated quantity
        if (menu.stock < newQuantity) {
          return sendError(res, `Cannot add more. Total in cart (${newQuantity}) exceeds stock (${menu.stock})`, [], 400);
        }

        await prisma.cart.update({
          where: { id: existing.id },
          data: { quantity: newQuantity },
        });
      } else {
        await prisma.cart.create({
          data: {
            userId,
            menuId: menu_id,
            quantity,
          },
        });
      }

      // Fetch the updated cart
      const updatedCart = await prisma.cart.findMany({
        where: { userId },
        include: cartInclude,
        orderBy: { id: 'asc' },
      });

      return sendSuccess(res, 'Item added to cart successfully', updatedCart.map(mapCartItem));
    } catch (error) {
      next(error);
    }
  }

  static async updateCartQuantity(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;

      // Find cart item
      const cartItem = await prisma.cart.findFirst({
        where: { id: Number(id), userId },
        include: { menu: true },
      });

      if (!cartItem) {
        return sendError(res, 'Cart item not found', [], 404);
      }

      // Verify stock
      if (cartItem.menu.stock < quantity) {
        return sendError(res, `Insufficient stock. Only ${cartItem.menu.stock} items left`, [], 400);
      }

      await prisma.cart.update({
        where: { id: Number(id) },
        data: { quantity },
      });

      return sendSuccess(res, 'Cart quantity updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const cartItem = await prisma.cart.findFirst({ where: { id: Number(id), userId } });
      if (!cartItem) {
        return sendError(res, 'Cart item not found', [], 404);
      }

      await prisma.cart.delete({ where: { id: Number(id) } });
      return sendSuccess(res, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const userId = req.user.id;
      await prisma.cart.deleteMany({ where: { userId } });
      return sendSuccess(res, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;

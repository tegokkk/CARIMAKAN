const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

class MerchantController {
  // --- DASHBOARD ---
  static async getDashboard(req, res, next) {
    try {
      const merchantId = req.user.id;
      
      const restaurants = await prisma.restaurant.findMany({
        where: { ownerId: merchantId },
        select: { id: true }
      });
      const restaurantIds = restaurants.map(r => r.id);

      const [totalRestaurants, totalMenus, totalOrders, revenue] = await Promise.all([
        prisma.restaurant.count({ where: { ownerId: merchantId } }),
        prisma.menu.count({ where: { restaurantId: { in: restaurantIds } } }),
        prisma.order.count({ where: { restaurantId: { in: restaurantIds } } }),
        prisma.order.aggregate({
          where: { restaurantId: { in: restaurantIds }, status: 'done' },
          _sum: { totalPrice: true }
        })
      ]);

      const recentOrders = await prisma.order.findMany({
        where: { restaurantId: { in: restaurantIds } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { name: true, email: true } } }
      });

      return sendSuccess(res, 'Merchant dashboard fetched', {
        totalRestaurants,
        totalMenus,
        totalOrders,
        totalRevenue: Number(revenue._sum.totalPrice || 0),
        recentOrders
      });
    } catch (error) {
      next(error);
    }
  }

  // --- RESTAURANTS ---
  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        where: { ownerId: req.user.id },
        orderBy: { createdAt: 'desc' }
      });
      return sendSuccess(res, 'Restaurants fetched', restaurants);
    } catch (error) {
      next(error);
    }
  }

  static async createRestaurant(req, res, next) {
    try {
      const { name, description, address, city, phone } = req.body;
      let { slug } = req.body;

      if (!name) return sendError(res, 'Name is required', [], 400);
      if (!slug) slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const existing = await prisma.restaurant.findUnique({ where: { slug } });
      if (existing) return sendError(res, 'Slug already in use', [], 400);

      // default status pending
      const restaurant = await prisma.restaurant.create({
        data: {
          name, slug, description, address, city, phone,
          ownerId: req.user.id,
          status: 'pending',
          isActive: false
        }
      });
      return sendSuccess(res, 'Restaurant created', restaurant, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateRestaurant(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: Number(id), ownerId: req.user.id }
      });
      if (!restaurant) return sendError(res, 'Restaurant not found or unauthorized', [], 404);

      const { name, description, address, city, phone, image } = data;

      const updated = await prisma.restaurant.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(phone !== undefined && { phone }),
          ...(image !== undefined && { image })
        }
      });
      return sendSuccess(res, 'Restaurant updated', updated);
    } catch (error) {
      next(error);
    }
  }

  // --- MENUS ---
  static async getMenus(req, res, next) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      const restaurantIds = restaurants.map(r => r.id);

      const menus = await prisma.menu.findMany({
        where: { restaurantId: { in: restaurantIds } },
        orderBy: { createdAt: 'desc' },
        include: { restaurant: { select: { name: true } }, category: { select: { name: true } } }
      });
      return sendSuccess(res, 'Menus fetched', menus);
    } catch (error) {
      next(error);
    }
  }

  static async createMenu(req, res, next) {
    try {
      const { restaurantId, categoryId, name, description, price, stock, isRecommended } = req.body;
      let { slug } = req.body;

      if (!name || !price || !restaurantId) return sendError(res, 'Name, price, and restaurantId required', [], 400);

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: Number(restaurantId), ownerId: req.user.id }
      });
      if (!restaurant) return sendError(res, 'Restaurant not found or unauthorized', [], 404);

      if (!slug) slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existing = await prisma.menu.findUnique({ where: { slug } });
      if (existing) slug = slug + '-' + Date.now();

      const menu = await prisma.menu.create({
        data: {
          restaurantId: Number(restaurantId),
          categoryId: categoryId ? Number(categoryId) : null,
          name, slug, description, 
          price: Number(price),
          stock: stock ? Number(stock) : 0,
          isRecommended: Boolean(isRecommended)
        }
      });
      return sendSuccess(res, 'Menu created', menu, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const menu = await prisma.menu.findUnique({
        where: { id: Number(id) },
        include: { restaurant: true }
      });

      if (!menu || menu.restaurant.ownerId !== req.user.id) {
        return sendError(res, 'Menu not found or unauthorized', [], 404);
      }

      if (data.price) data.price = Number(data.price);
      if (data.categoryId) data.categoryId = Number(data.categoryId);
      if (data.restaurantId) data.restaurantId = Number(data.restaurantId);
      if (data.stock !== undefined) data.stock = Number(data.stock);

      const updated = await prisma.menu.update({
        where: { id: Number(id) },
        data
      });
      return sendSuccess(res, 'Menu updated', updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMenu(req, res, next) {
    try {
      const { id } = req.params;
      const menu = await prisma.menu.findUnique({
        where: { id: Number(id) },
        include: { restaurant: true }
      });

      if (!menu || menu.restaurant.ownerId !== req.user.id) {
        return sendError(res, 'Menu not found or unauthorized', [], 404);
      }

      await prisma.menu.delete({ where: { id: Number(id) } });
      return sendSuccess(res, 'Menu deleted');
    } catch (error) {
      next(error);
    }
  }

  // --- ORDERS ---
  static async getOrders(req, res, next) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      const restaurantIds = restaurants.map(r => r.id);

      const orders = await prisma.order.findMany({
        where: { restaurantId: { in: restaurantIds } },
        orderBy: { createdAt: 'desc' },
        include: { 
          user: { select: { name: true, email: true } },
          restaurant: { select: { name: true } },
          items: { include: { menu: { select: { name: true, image: true } } } }
        }
      });
      return sendSuccess(res, 'Orders fetched', orders);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'accepted', 'processing', 'ready', 'done', 'cancelled'].includes(status)) {
        return sendError(res, 'Invalid status', [], 400);
      }

      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: { restaurant: true }
      });

      if (!order || order.restaurant.ownerId !== req.user.id) {
        return sendError(res, 'Order not found or unauthorized', [], 404);
      }

      const updated = await prisma.order.update({
        where: { id: Number(id) },
        data: { status }
      });

      return sendSuccess(res, 'Order status updated', updated);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MerchantController;

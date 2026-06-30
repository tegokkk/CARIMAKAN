const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

const mapUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  created_at: user.createdAt,
});

const mapOrder = (order) => ({
  id: order.id,
  user_id: order.userId,
  order_code: order.orderCode,
  total_price: Number(order.totalPrice || 0),
  status: order.status,
  payment_method: order.paymentMethod,
  customer_name: order.customerName,
  customer_phone: order.customerPhone,
  delivery_address: order.deliveryAddress,
  notes: order.notes,
  created_at: order.createdAt,
  updated_at: order.updatedAt,
  user_name: order.user?.name,
  user_email: order.user?.email,
});

class AdminController {
  static async getStats(req, res, next) {
    try {
      const [
        totalUsers,
        totalRestaurants,
        totalMenus,
        totalOrders,
        revenue,
        latestOrdersRaw,
        popularGroups,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.restaurant.count(),
        prisma.menu.count(),
        prisma.order.count(),
        prisma.order.aggregate({
          where: { status: { not: 'cancelled' } },
          _sum: { totalPrice: true },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { user: true },
        }),
        prisma.orderItem.groupBy({
          by: ['menuId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
      ]);

      const menuIds = popularGroups.map((group) => group.menuId);
      const popularMenuRows = menuIds.length
        ? await prisma.menu.findMany({
            where: { id: { in: menuIds } },
            include: { restaurant: true },
          })
        : [];
      const popularById = new Map(popularMenuRows.map((menu) => [menu.id, menu]));
      const latestOrders = latestOrdersRaw.map(mapOrder);
      const popularMenus = popularGroups.map((group) => {
        const menu = popularById.get(group.menuId);
        return {
          id: group.menuId,
          name: menu?.name,
          price: Number(menu?.price || 0),
          image: menu?.image,
          restaurant_name: menu?.restaurant?.name,
          total_sold: group._sum.quantity || 0,
        };
      });
      const totalRevenue = Number(revenue._sum.totalPrice || 0);

      const stats = {
        total_users: totalUsers,
        total_restaurants: totalRestaurants,
        total_menus: totalMenus,
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        recent_orders: latestOrders,
        popular_menus: popularMenus,
        totalUsers,
        totalRestaurants,
        totalMenus,
        totalOrders,
        totalRevenue,
        latestOrders,
        popularMenus
      };

      return sendSuccess(res, 'Admin stats fetched successfully', stats);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
      return sendSuccess(res, 'Users fetched successfully', users.map(mapUser));
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin', 'merchant'].includes(role)) {
        return sendError(res, 'Role tidak valid', [], 400);
      }

      const existing = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!existing) {
        return sendError(res, 'User tidak ditemukan', [], 404);
      }

      const updated = await prisma.user.update({
        where: { id: Number(id) },
        data: { role },
      });
      return sendSuccess(res, 'User role updated successfully', mapUser(updated));
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (Number(id) === req.user.id) {
        return sendError(res, 'Admin tidak bisa menghapus akun sendiri', [], 400);
      }

      const existing = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!existing) {
        return sendError(res, 'User tidak ditemukan', [], 404);
      }

      await prisma.user.delete({ where: { id: Number(id) } });
      return sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMerchants(req, res, next) {
    try {
      const merchants = await prisma.user.findMany({
        where: { role: 'merchant' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
      return sendSuccess(res, 'Merchants fetched successfully', merchants.map(mapUser));
    } catch (error) {
      next(error);
    }
  }

  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { id: true, name: true, email: true } } }
      });
      return sendSuccess(res, 'Restaurants fetched successfully', restaurants);
    } catch (error) {
      next(error);
    }
  }

  static async updateRestaurantStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
        return sendError(res, 'Status tidak valid', [], 400);
      }

      const existing = await prisma.restaurant.findUnique({ where: { id: Number(id) } });
      if (!existing) {
        return sendError(res, 'Restaurant tidak ditemukan', [], 404);
      }

      const updated = await prisma.restaurant.update({
        where: { id: Number(id) },
        data: { status, isActive: status === 'approved' },
      });
      
      return sendSuccess(res, 'Restaurant status updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;

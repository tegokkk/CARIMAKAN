const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const addReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string().optional()
  })
});

// Helper to update menu and restaurant ratings
const updateRatings = async (tx, menuId) => {
  const avgMenu = await tx.review.aggregate({
    where: { menuId },
    _avg: { rating: true },
  });
  const newMenuRating = avgMenu._avg.rating || 0;

  const menu = await tx.menu.update({
    where: { id: menuId },
    data: { rating: newMenuRating },
  });

  if (menu.restaurantId) {
    const avgRest = await tx.menu.aggregate({
      where: {
        restaurantId: menu.restaurantId,
        isActive: true,
      },
      _avg: { rating: true },
    });
    await tx.restaurant.update({
      where: { id: menu.restaurantId },
      data: { rating: avgRest._avg.rating || 0 },
    });
  }
};

const mapReview = (review) => ({
  id: review.id,
  user_id: review.userId,
  menu_id: review.menuId,
  rating: review.rating,
  comment: review.comment,
  created_at: review.createdAt,
  updated_at: review.updatedAt,
  user_name: review.user?.name,
  user_avatar: review.user?.avatar,
});

class ReviewController {
  static get addReviewSchema() {
    return addReviewSchema;
  }

  static async getMenuReviews(req, res, next) {
    try {
      const { menuId } = req.params;

      const reviews = await prisma.review.findMany({
        where: { menuId: Number(menuId) },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'Reviews fetched successfully', reviews.map(mapReview));
    } catch (error) {
      next(error);
    }
  }

  static async addReview(req, res, next) {
    try {
      const userId = req.user.id;
      const { menuId } = req.params;
      const { rating, comment } = req.body;
      const numericMenuId = Number(menuId);

      // Check if menu exists
      const menu = await prisma.menu.findUnique({ where: { id: numericMenuId } });
      if (!menu) {
        return sendError(res, 'Menu item not found', [], 404);
      }

      const existing = await prisma.review.findUnique({
        where: { userId_menuId: { userId, menuId: numericMenuId } },
      });
      if (existing) {
        return sendError(res, 'You have already reviewed this menu item', [], 400);
      }

      const review = await prisma.$transaction(async (tx) => {
        const created = await tx.review.create({
          data: {
            userId,
            menuId: numericMenuId,
            rating,
            comment: comment || null,
          },
        });
        await updateRatings(tx, numericMenuId);
        return created;
      });

      return sendSuccess(res, 'Review added successfully', { id: review.id, user_id: userId, menu_id: numericMenuId, rating, comment }, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Find review
      const review = await prisma.review.findUnique({ where: { id: Number(id) } });
      if (!review) {
        return sendError(res, 'Review not found', [], 404);
      }

      // Access control: User who wrote it or Admin
      if (userRole !== 'admin' && review.userId !== userId) {
        return sendError(res, 'Access denied', [], 403);
      }

      await prisma.$transaction(async (tx) => {
        await tx.review.delete({ where: { id: Number(id) } });
        await updateRatings(tx, review.menuId);
      });

      return sendSuccess(res, 'Review deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController;

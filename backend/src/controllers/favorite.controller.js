const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

const mapFavorite = (favorite) => ({
  favorite_id: favorite.id,
  favorited_at: favorite.createdAt,
  id: favorite.menu.id,
  restaurant_id: favorite.menu.restaurantId,
  category_id: favorite.menu.categoryId,
  name: favorite.menu.name,
  slug: favorite.menu.slug,
  description: favorite.menu.description,
  price: Number(favorite.menu.price || 0),
  image: favorite.menu.image,
  rating: Number(favorite.menu.rating || 0),
  stock: favorite.menu.stock,
  is_recommended: favorite.menu.isRecommended ? 1 : 0,
  is_active: favorite.menu.isActive ? 1 : 0,
  created_at: favorite.menu.createdAt,
  updated_at: favorite.menu.updatedAt,
  restaurant_name: favorite.menu.restaurant?.name,
});

class FavoriteController {
  static async getFavorites(req, res, next) {
    try {
      const userId = req.user.id;

      const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          menu: {
            include: {
              restaurant: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, 'Favorite menus fetched successfully', favorites.map(mapFavorite));
    } catch (error) {
      next(error);
    }
  }

  static async addFavorite(req, res, next) {
    try {
      const userId = req.user.id;
      const { menuId } = req.params;

      // Check if menu exists
      const menu = await prisma.menu.findUnique({ where: { id: Number(menuId) } });
      if (!menu) {
        return sendError(res, 'Menu item not found', [], 404);
      }

      // Check duplicate
      const existing = await prisma.favorite.findUnique({
        where: { userId_menuId: { userId, menuId: Number(menuId) } },
      });

      if (existing) {
        return sendSuccess(res, 'Menu item is already in favorites', {
          id: existing.id,
          user_id: userId,
          menu_id: Number(menuId),
        });
      }

      const result = await prisma.favorite.create({
        data: { userId, menuId: Number(menuId) },
      });

      return sendSuccess(res, 'Menu item added to favorites', { id: result.id, user_id: userId, menu_id: Number(menuId) }, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async removeFavorite(req, res, next) {
    try {
      const userId = req.user.id;
      const { menuId } = req.params;

      const existing = await prisma.favorite.findUnique({
        where: { userId_menuId: { userId, menuId: Number(menuId) } },
      });

      if (!existing) {
        return sendError(res, 'Favorite item not found', [], 404);
      }

      await prisma.favorite.delete({ where: { id: existing.id } });

      return sendSuccess(res, 'Menu item removed from favorites');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;

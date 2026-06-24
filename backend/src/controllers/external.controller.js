const ExternalMealService = require('../services/externalMeal.service');
const prisma = require('../config/prisma');
const slugify = require('../utils/slugify');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const importMealSchema = z.object({
  body: z.object({
    restaurant_id: z.number().int().positive('Restaurant ID is required'),
    category_id: z.number().int().positive('Category ID is required'),
    price: z.number().positive().optional().default(15000),
    stock: z.number().int().nonnegative().optional().default(10)
  })
});

class ExternalController {
  static get importMealSchema() {
    return importMealSchema;
  }

  static async searchMeals(req, res, next) {
    try {
      const { query } = req.query;
      const meals = await ExternalMealService.searchMeals(query || '');
      return sendSuccess(res, 'External meals fetched successfully', meals);
    } catch (error) {
      return sendError(res, error.message, [], 500);
    }
  }

  static async getMealDetail(req, res, next) {
    try {
      const { id } = req.params;
      const meal = await ExternalMealService.getMealDetail(id);
      if (!meal) {
        return sendError(res, 'Meal not found in TheMealDB', [], 404);
      }
      return sendSuccess(res, 'External meal details fetched successfully', meal);
    } catch (error) {
      return sendError(res, error.message, [], 500);
    }
  }

  static async importMeal(req, res, next) {
    try {
      const { id } = req.params;
      const { restaurant_id, category_id, price, stock } = req.body;

      // 1. Fetch meal from TheMealDB
      const meal = await ExternalMealService.getMealDetail(id);
      if (!meal) {
        return sendError(res, 'Meal not found in TheMealDB', [], 404);
      }

      const name = meal.strMeal;
      const slug = slugify(name);
      const description = meal.strInstructions || `Instructions for ${name}`;
      const image = meal.strMealThumb || null;

      // 2. Check if already exists locally
      const existing = await prisma.menu.findUnique({ where: { slug } });
      if (existing) {
        return sendError(res, 'Meal already imported or menu with same name exists', [], 400);
      }

      // 3. Verify restaurant and category exist
      const rest = await prisma.restaurant.findUnique({ where: { id: restaurant_id } });
      if (!rest) {
        return sendError(res, 'Restaurant not found', [], 400);
      }

      const cat = await prisma.category.findUnique({ where: { id: category_id } });
      if (!cat) {
        return sendError(res, 'Category not found', [], 400);
      }

      const newMenu = await prisma.menu.create({
        data: {
          restaurantId: restaurant_id,
          categoryId: category_id,
          name,
          slug,
          description,
          price,
          image,
          stock,
          isRecommended: false,
          isActive: true,
        },
      });

      return sendSuccess(res, 'Meal imported successfully to local database', {
        id: newMenu.id,
        restaurant_id: newMenu.restaurantId,
        category_id: newMenu.categoryId,
        name: newMenu.name,
        slug: newMenu.slug,
        description: newMenu.description,
        price: Number(newMenu.price || 0),
        image: newMenu.image,
        stock: newMenu.stock,
        is_recommended: newMenu.isRecommended ? 1 : 0,
        is_active: newMenu.isActive ? 1 : 0,
        created_at: newMenu.createdAt,
        updated_at: newMenu.updatedAt,
      }, null, 201);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExternalController;

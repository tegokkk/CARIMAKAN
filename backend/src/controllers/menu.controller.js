const prisma = require('../config/prisma');
const MenuService = require('../services/menu.service');
const slugify = require('../utils/slugify');
const { getPaginationData } = require('../utils/pagination');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const menuSchema = z.object({
  body: z.object({
    restaurant_id: z.preprocess((val) => Number(val), z.number().int().positive('Restaurant ID is required')),
    category_id: z.preprocess((val) => Number(val), z.number().int().positive('Category ID is required')),
    name: z.string().min(1, 'Menu name is required'),
    description: z.string().optional(),
    price: z.preprocess((val) => Number(val), z.number().positive('Price must be positive')),
    stock: z.preprocess((val) => Number(val), z.number().int().nonnegative().optional().default(0)),
    is_recommended: z.preprocess((val) => {
      if (val === 'true' || val === '1' || val === 1) return 1;
      return 0;
    }, z.number().int().min(0).max(1).optional().default(0)),
    is_active: z.preprocess((val) => {
      if (val === 'false' || val === '0' || val === 0) return 0;
      return 1;
    }, z.number().int().min(0).max(1).optional().default(1))
  })
});

class MenuController {
  static get menuSchema() {
    return menuSchema;
  }

  static async getStats(req, res, next) {
    try {
      const stats = await MenuService.stats();
      return sendSuccess(res, 'Menu stats fetched successfully', stats);
    } catch (error) {
      next(error);
    }
  }

  static async getMenus(req, res, next) {
    try {
      const data = await MenuService.getMenus(req.query);
      const paginationData = getPaginationData(data.totalItems, data.page, data.limit);
      return sendSuccess(res, 'Menus fetched successfully', data.menus, paginationData);
    } catch (error) {
      next(error);
    }
  }

  static async getMenuById(req, res, next) {
    try {
      const { id } = req.params;
      const menu = await MenuService.getById(Number(id));

      if (!menu) {
        return sendError(res, 'Menu not found', [], 404);
      }

      return sendSuccess(res, 'Menu fetched successfully', menu);
    } catch (error) {
      next(error);
    }
  }

  static async getRecommended(req, res, next) {
    try {
      const menus = await MenuService.getRecommended();
      return sendSuccess(res, 'Recommended menus fetched successfully', menus);
    } catch (error) {
      next(error);
    }
  }

  static async createMenu(req, res, next) {
    try {
      const { restaurant_id, category_id, name, description, price, stock, is_recommended, is_active } = req.body;
      const slug = slugify(name);

      // Check duplicate slug
      const existing = await prisma.menu.findUnique({ where: { slug } });
      if (existing) {
        return sendError(res, 'Menu name/slug already exists', [], 400);
      }

      // Check restaurant & category exists
      const rest = await prisma.restaurant.findUnique({ where: { id: restaurant_id } });
      if (!rest) {
        return sendError(res, 'Restaurant not found', [], 400);
      }

      const cat = await prisma.category.findUnique({ where: { id: category_id } });
      if (!cat) {
        return sendError(res, 'Category not found', [], 400);
      }

      const imagePath = req.file ? `uploads/${req.file.filename}` : null;
      const newMenu = await MenuService.create({
        restaurant_id,
        category_id,
        name,
        slug,
        description,
        price,
        stock,
        is_recommended,
        is_active,
      }, imagePath);

      return sendSuccess(res, 'Menu created successfully', newMenu, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateMenu(req, res, next) {
    try {
      const { id } = req.params;
      const { restaurant_id, category_id, name, description, price, stock, is_recommended, is_active } = req.body;
      const slug = slugify(name);

      // Check existence
      const menu = await prisma.menu.findUnique({ where: { id: Number(id) } });
      if (!menu) {
        return sendError(res, 'Menu not found', [], 404);
      }

      // Check duplicate slug for other records
      const existing = await prisma.menu.findUnique({ where: { slug } });
      if (existing && existing.id !== Number(id)) {
        return sendError(res, 'Menu name/slug already exists', [], 400);
      }

      // Check restaurant & category exists
      const rest = await prisma.restaurant.findUnique({ where: { id: restaurant_id } });
      if (!rest) {
        return sendError(res, 'Restaurant not found', [], 400);
      }

      const cat = await prisma.category.findUnique({ where: { id: category_id } });
      if (!cat) {
        return sendError(res, 'Category not found', [], 400);
      }

      let imagePath = menu.image;
      if (req.file) {
        imagePath = `uploads/${req.file.filename}`;
      }

      const updatedMenu = await MenuService.update(Number(id), {
        restaurant_id,
        category_id,
        name,
        slug,
        description,
        price,
        stock,
        is_recommended,
        is_active,
      }, imagePath);
      return sendSuccess(res, 'Menu updated successfully', updatedMenu);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMenu(req, res, next) {
    try {
      const { id } = req.params;

      const menu = await prisma.menu.findUnique({ where: { id: Number(id) } });
      if (!menu) {
        return sendError(res, 'Menu not found', [], 404);
      }

      await prisma.menu.delete({ where: { id: Number(id) } });
      return sendSuccess(res, 'Menu deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MenuController;

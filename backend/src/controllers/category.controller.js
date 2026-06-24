const prisma = require('../config/prisma');
const slugify = require('../utils/slugify');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional()
  })
});

const mapCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  created_at: category.createdAt,
  updated_at: category.updatedAt,
});

class CategoryController {
  static get categorySchema() {
    return categorySchema;
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      return sendSuccess(res, 'Categories fetched successfully', categories.map(mapCategory));
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      const slug = slugify(name);

      // Check duplicate slug
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        return sendError(res, 'Category name/slug already exists', [], 400);
      }

      const newCategory = await prisma.category.create({
        data: {
          name,
          slug,
          description: description || null,
        },
      });

      return sendSuccess(res, 'Category created successfully', mapCategory(newCategory), null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const slug = slugify(name);

      // Check existence
      const category = await prisma.category.findUnique({ where: { id: Number(id) } });
      if (!category) {
        return sendError(res, 'Category not found', [], 404);
      }

      // Check duplicate slug for other records
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing && existing.id !== Number(id)) {
        return sendError(res, 'Category name/slug already exists', [], 400);
      }

      const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
          description: description || null,
        },
      });
      return sendSuccess(res, 'Category updated successfully', mapCategory(updatedCategory));
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({ where: { id: Number(id) } });
      if (!category) {
        return sendError(res, 'Category not found', [], 404);
      }

      await prisma.category.delete({ where: { id: Number(id) } });
      return sendSuccess(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;

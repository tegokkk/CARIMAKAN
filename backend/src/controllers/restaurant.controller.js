const prisma = require('../config/prisma');
const slugify = require('../utils/slugify');
const { sendSuccess, sendError } = require('../utils/response');
const { z } = require('zod');

const restaurantSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Restaurant name is required'),
    description: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    image_url: z.string().trim().url('Image URL must be valid').or(z.literal('')).optional(),
    is_active: z.preprocess((val) => {
      if (val === 'true' || val === '1' || val === 1) return 1;
      if (val === 'false' || val === '0' || val === 0) return 0;
      return val;
    }, z.number().int().min(0).max(1).optional().default(1))
  })
});

const toBool = (value) => value === true || value === 1 || value === '1';

const mapRestaurant = (restaurant) => ({
  id: restaurant.id,
  name: restaurant.name,
  slug: restaurant.slug,
  description: restaurant.description,
  address: restaurant.address,
  city: restaurant.city,
  phone: restaurant.phone,
  image: restaurant.image,
  rating: Number(restaurant.rating || 0),
  is_active: restaurant.isActive ? 1 : 0,
  created_at: restaurant.createdAt,
  updated_at: restaurant.updatedAt,
});

class RestaurantController {
  static get restaurantSchema() {
    return restaurantSchema;
  }

  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await prisma.restaurant.findMany({
        where: { isActive: true, status: 'approved' },
        orderBy: [{ rating: 'desc' }, { name: 'asc' }],
      });
      return sendSuccess(res, 'Restaurants fetched successfully', restaurants.map(mapRestaurant));
    } catch (error) {
      next(error);
    }
  }

  static async getRestaurantById(req, res, next) {
    try {
      const { id } = req.params;
      const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(id) } });

      if (!restaurant || (restaurant.status !== 'approved' && !req?.headers?.['x-admin'])) {
        return sendError(res, 'Restaurant not found', [], 404);
      }

      return sendSuccess(res, 'Restaurant fetched successfully', mapRestaurant(restaurant));
    } catch (error) {
      next(error);
    }
  }

  static async createRestaurant(req, res, next) {
    try {
      const { name, description, address, city, phone, image_url, is_active } = req.body;
      const slug = slugify(name);

      // Check duplicate slug
      const existing = await prisma.restaurant.findUnique({ where: { slug } });
      if (existing) {
        return sendError(res, 'Restaurant name/slug already exists', [], 400);
      }

      // Check image upload
      const imagePath = image_url || (req.file ? `uploads/${req.file.filename}` : null);

      const newRestaurant = await prisma.restaurant.create({
        data: {
          name,
          slug,
          description: description || null,
          address: address || null,
          city: city || null,
          phone: phone || null,
          image: imagePath,
          isActive: toBool(is_active),
        },
      });

      return sendSuccess(res, 'Restaurant created successfully', mapRestaurant(newRestaurant), null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateRestaurant(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, address, city, phone, image_url, is_active } = req.body;
      const slug = slugify(name);

      // Check existence
      const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(id) } });
      if (!restaurant) {
        return sendError(res, 'Restaurant not found', [], 404);
      }

      // Check duplicate slug for other records
      const existing = await prisma.restaurant.findUnique({ where: { slug } });
      if (existing && existing.id !== Number(id)) {
        return sendError(res, 'Restaurant name/slug already exists', [], 400);
      }

      // Handle image
      let imagePath = restaurant.image;
      if (image_url) {
        imagePath = image_url;
      }
      if (!image_url && req.file) {
        imagePath = `uploads/${req.file.filename}`;
      }

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
          description: description || null,
          address: address || null,
          city: city || null,
          phone: phone || null,
          image: imagePath,
          isActive: toBool(is_active),
        },
      });
      return sendSuccess(res, 'Restaurant updated successfully', mapRestaurant(updatedRestaurant));
    } catch (error) {
      next(error);
    }
  }

  static async deleteRestaurant(req, res, next) {
    try {
      const { id } = req.params;

      const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(id) } });
      if (!restaurant) {
        return sendError(res, 'Restaurant not found', [], 404);
      }

      await prisma.restaurant.delete({ where: { id: Number(id) } });
      return sendSuccess(res, 'Restaurant deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RestaurantController;

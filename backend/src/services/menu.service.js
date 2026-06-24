const prisma = require('../config/prisma');
const { getPagination } = require('../utils/pagination');

const mapMenu = (menu) => ({
  id: menu.id,
  restaurant_id: menu.restaurantId,
  category_id: menu.categoryId,
  name: menu.name,
  slug: menu.slug,
  description: menu.description,
  price: Number(menu.price || 0),
  image: menu.image,
  rating: Number(menu.rating || 0),
  stock: menu.stock,
  is_recommended: menu.isRecommended ? 1 : 0,
  is_active: menu.isActive ? 1 : 0,
  created_at: menu.createdAt,
  updated_at: menu.updatedAt,
  restaurant_name: menu.restaurant?.name,
  category_name: menu.category?.name,
});

const menuInclude = {
  restaurant: true,
  category: true,
};

class MenuService {
  static async getMenus(query) {
    const { search, category, minPrice, maxPrice, rating, sort, page, limit, includeInactive } = query;
    const { page: currentPage, limit: currentLimit, offset } = getPagination(page, limit);

    const where = {};

    if (includeInactive !== '1' && includeInactive !== 'true') {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.categoryId = Number(category);
    }

    if (minPrice) {
      where.price = {
        ...(where.price || {}),
        gte: Number(minPrice),
      };
    }

    if (maxPrice) {
      where.price = {
        ...(where.price || {}),
        lte: Number(maxPrice),
      };
    }

    if (rating) {
      where.rating = {
        gte: Number(rating),
      };
    }

    const totalItems = await prisma.menu.count({ where });

    // Sorting
    let orderBy = { name: 'asc' };
    if (sort === 'popular') {
      orderBy = [{ rating: 'desc' }, { name: 'asc' }];
    } else if (sort === 'latest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const menus = await prisma.menu.findMany({
      where,
      include: menuInclude,
      orderBy,
      take: currentLimit,
      skip: offset,
    });

    return {
      menus: menus.map(mapMenu),
      totalItems,
      page: currentPage,
      limit: currentLimit
    };
  }

  static async getById(id) {
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: menuInclude,
    });
    return menu ? mapMenu(menu) : null;
  }

  static async getRecommended() {
    const menus = await prisma.menu.findMany({
      where: {
        isRecommended: true,
        isActive: true,
      },
      include: menuInclude,
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });
    return menus.map(mapMenu);
  }

  static async create(data, imagePath) {
    const menu = await prisma.menu.create({
      data: {
        restaurantId: data.restaurant_id,
        categoryId: data.category_id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        image: imagePath,
        stock: data.stock,
        isRecommended: Boolean(data.is_recommended),
        isActive: Boolean(data.is_active),
      },
      include: menuInclude,
    });
    return mapMenu(menu);
  }

  static async update(id, data, imagePath) {
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        restaurantId: data.restaurant_id,
        categoryId: data.category_id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        image: imagePath,
        stock: data.stock,
        isRecommended: Boolean(data.is_recommended),
        isActive: Boolean(data.is_active),
      },
      include: menuInclude,
    });
    return mapMenu(menu);
  }

  static async stats() {
    const [menuAggregate, totalMenus, totalRestaurants, totalCustomers] = await Promise.all([
      prisma.menu.aggregate({
        where: {
          isActive: true,
          rating: { gt: 0 },
        },
        _avg: { rating: true },
      }),
      prisma.menu.count({ where: { isActive: true } }),
      prisma.restaurant.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'user' } }),
    ]);

    return {
      total_menus: totalMenus,
      total_restaurants: totalRestaurants,
      total_customers: totalCustomers,
      average_rating: Number(menuAggregate._avg.rating || 0).toFixed ? Number(Number(menuAggregate._avg.rating || 0).toFixed(1)) : 0,
    };
  }
}

module.exports = MenuService;

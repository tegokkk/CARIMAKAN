const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const prisma = require('./src/config/prisma');
const slugify = require('./src/utils/slugify');

const mdPath = path.resolve(__dirname, '..', 'Data_Makanan_CariMakan_Link_Gambar.md');

function readFoodsFromMarkdown() {
  const md = fs.readFileSync(mdPath, 'utf8');
  const jsonBlock = md.match(/```json\s*([\s\S]*?)```/i);

  if (!jsonBlock) {
    throw new Error('Blok JSON makanan tidak ditemukan di file MD.');
  }

  const foods = JSON.parse(jsonBlock[1]);
  if (!Array.isArray(foods) || foods.length === 0) {
    throw new Error('Data makanan di file MD kosong atau tidak valid.');
  }

  return foods;
}

function normalizeBool(value) {
  return value === true || value === 1 || value === '1';
}

async function seedFromMD() {
  const foods = readFoodsFromMarkdown();

  console.log('Terhubung ke database. Menghapus data lama...');

  try {
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.category.deleteMany();
    await prisma.restaurant.deleteMany();

    console.log('Data lama berhasil dihapus.');

    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'CariMakan Food Hall',
        slug: 'carimakan-food-hall',
        description: 'Pusat kuliner CariMakan dengan pilihan makanan dari data MD.',
        address: 'Jl. Sudirman No. 1, Bandar Lampung',
        city: 'Bandar Lampung',
        phone: '081234567890',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        rating: 4.9,
        isActive: true,
      },
    });

    const categoryNames = [...new Set(foods.map((food) => food.category))];
    const categoryIds = {};

    for (const name of categoryNames) {
      const category = await prisma.category.create({
        data: {
          name,
          slug: slugify(name),
          description: `Kategori ${name}`,
        },
      });
      categoryIds[name] = category.id;
    }

    console.log(`${categoryNames.length} kategori berhasil dibuat.`);

    for (const food of foods) {
      await prisma.menu.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: categoryIds[food.category],
          name: food.name,
          slug: food.slug || slugify(food.name),
          description: food.description || null,
          price: food.price,
          image: food.image || null,
          rating: food.rating || 0,
          stock: 100,
          isRecommended: normalizeBool(food.is_recommended),
          isActive: normalizeBool(food.is_active),
        },
      });
    }

    console.log(`Selesai. ${foods.length} menu dari MD berhasil dimasukkan.`);
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFromMD().catch((error) => {
  console.error('Gagal seed data dari MD:', error.message);
  process.exit(1);
});

require('dotenv').config({ path: __dirname + '/../.env' });

const prisma = require('./config/prisma');

async function seed() {
  console.log('Connected to DB. Seeding data...');

  try {
    // 1. Tambah Restoran Dummy
    const resto1 = await prisma.restaurant.create({
      data: {
        name: 'Warung Nasi Goreng Gila',
        slug: 'warung-nasi-goreng-gila',
        description: 'Nasi goreng paling mantap di kota',
        address: 'Jl. Sudirman No. 10',
        image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=500&q=80',
        rating: 4.8,
        isActive: true,
      },
    });
    const resto2 = await prisma.restaurant.create({
      data: {
        name: 'Ayam Geprek Bensu',
        slug: 'ayam-geprek-bensu',
        description: 'Ayam geprek pedas nampol',
        address: 'Jl. Merdeka No. 45',
        image: 'https://images.unsplash.com/photo-1626082895617-2c636735e07a?w=500&q=80',
        rating: 4.5,
        isActive: true,
      },
    });

    // 2. Tambah Kategori Dummy
    const cat1 = await prisma.category.create({
      data: {
        name: 'Nasi',
        slug: 'nasi',
        description: 'Olahan nasi',
      },
    });
    const cat2 = await prisma.category.create({
      data: {
        name: 'Ayam',
        slug: 'ayam',
        description: 'Olahan ayam',
      },
    });

    // 3. Tambah Menu Dummy
    await prisma.menu.createMany({
      data: [
        {
          restaurantId: resto1.id,
          categoryId: cat1.id,
          name: 'Nasi Goreng Spesial',
          slug: 'nasi-goreng-spesial',
          description: 'Nasi goreng dengan telur, sosis, dan bakso',
          price: 25000,
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
          isActive: true,
        },
        {
          restaurantId: resto1.id,
          categoryId: cat1.id,
          name: 'Nasi Goreng Seafood',
          slug: 'nasi-goreng-seafood',
          description: 'Nasi goreng dengan udang dan cumi',
          price: 35000,
          image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80',
          isActive: true,
        },
        {
          restaurantId: resto2.id,
          categoryId: cat2.id,
          name: 'Ayam Geprek Level 5',
          slug: 'ayam-geprek-level-5',
          description: 'Ayam geprek super pedas',
          price: 20000,
          image: 'https://images.unsplash.com/photo-1626082895617-2c636735e07a?w=500&q=80',
          isActive: true,
        },
        {
          restaurantId: resto2.id,
          categoryId: cat2.id,
          name: 'Ayam Bakar Madu',
          slug: 'ayam-bakar-madu',
          description: 'Ayam bakar manis gurih',
          price: 28000,
          image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&q=80',
          isActive: true,
        },
      ],
    });

    console.log('Seeding berhasil!');
  } catch (error) {
    console.error('Seeding gagal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

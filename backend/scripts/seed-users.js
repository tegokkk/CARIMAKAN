const bcrypt = require('bcrypt');
const prisma = require('../src/config/prisma');

const defaultUsers = [
  {
    name: 'Admin CariMakan',
    email: 'admin@carimakan.test',
    password: 'admin123',
    phone: '081111111111',
    role: 'admin',
  },
  {
    name: 'User CariMakan',
    email: 'user@carimakan.test',
    password: 'user123',
    phone: '082222222222',
    role: 'user',
  },
];

async function seedUsers() {
  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        phone: user.phone,
        role: user.role,
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        phone: user.phone,
        role: user.role,
      },
    });
  }

  console.log('Default users seeded:');
  defaultUsers.forEach((user) => {
    console.log(`- ${user.role}: ${user.email} / ${user.password}`);
  });
}

seedUsers()
  .catch((error) => {
    console.error('Failed to seed users:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

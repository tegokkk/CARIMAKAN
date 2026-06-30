const prisma = require('../src/config/prisma');
const bcrypt = require('bcrypt');

async function main() {
  try {
    console.log('Starting default merchant migration...');
    
    // Check if default merchant exists
    let defaultMerchant = await prisma.user.findUnique({
      where: { email: 'merchant_lama@carimakan.com' }
    });

    if (!defaultMerchant) {
      console.log('Creating default merchant...');
      const hashedPassword = await bcrypt.hash('merchant123', 10);
      defaultMerchant = await prisma.user.create({
        data: {
          name: 'Default Merchant (Legacy)',
          email: 'merchant_lama@carimakan.com',
          password: hashedPassword,
          role: 'merchant',
          phone: '081234567890'
        }
      });
      console.log('Default merchant created with ID:', defaultMerchant.id);
    } else {
      console.log('Default merchant already exists with ID:', defaultMerchant.id);
    }

    // Assign orphaned restaurants
    const orphanedRestaurants = await prisma.restaurant.findMany({
      where: { ownerId: null }
    });

    if (orphanedRestaurants.length > 0) {
      console.log(`Found ${orphanedRestaurants.length} orphaned restaurants. Assigning to default merchant...`);
      const updateResult = await prisma.restaurant.updateMany({
        where: { ownerId: null },
        data: { ownerId: defaultMerchant.id, status: 'approved' }
      });
      console.log(`Successfully updated ${updateResult.count} restaurants.`);
    } else {
      console.log('No orphaned restaurants found.');
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

const app = require('./app');
const prisma = require('./config/prisma');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test DB Connection before starting server
const startServer = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

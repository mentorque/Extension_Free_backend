const { PrismaClient } = require("../../generated/prisma");

// Optimized Prisma client with connection pooling and performance settings
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'minimal',
  // Connection pooling is handled via DATABASE_URL connection string parameters
  // Example: ?connection_limit=10&pool_timeout=20
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;

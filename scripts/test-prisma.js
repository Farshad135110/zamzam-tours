(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const rows = await prisma.renamedpackage.findMany();
    console.log(JSON.stringify(rows, null, 2));
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    console.error('Prisma query failed:', e);
    try { await require('@prisma/client').PrismaClient.prototype.$disconnect(); } catch {};
    process.exit(1);
  }
})();

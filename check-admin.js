const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.$queryRaw`
      SELECT user_id, username, email, full_name, is_active 
      FROM admin_users 
      WHERE is_active = true
    `;
    
    console.log('\n=== ACTIVE ADMIN USERS ===\n');
    users.forEach(u => {
      console.log('User ID:', u.user_id);
      console.log('Username:', u.username);
      console.log('Email:', u.email);
      console.log('Full Name:', u.full_name);
      console.log('---');
    });
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();

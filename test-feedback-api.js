const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFeedback() {
  try {
    console.log('Testing feedback API...\n');
    
    const feedbacks = await prisma.feedback.findMany();
    
    console.log(`Found ${feedbacks.length} feedbacks in database:`);
    console.log(JSON.stringify(feedbacks, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFeedback();

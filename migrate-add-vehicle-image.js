// Quick migration script to add vehicle_image_urls column
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  try {
    console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    console.log('Running migrations...');
    
    // Drop old single-image column if it exists
    try {
      await pool.query(`ALTER TABLE quotations DROP COLUMN IF EXISTS vehicle_image_url;`);
      console.log('Dropped old vehicle_image_url column');
    } catch (e) {
      // Column might not exist, ignore
    }
    
    // Add new multi-image column
    await pool.query(`
      ALTER TABLE quotations 
      ADD COLUMN IF NOT EXISTS vehicle_image_urls TEXT[];
    `);
    console.log('✅ Added vehicle_image_urls column');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

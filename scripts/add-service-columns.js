const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function addColumns() {
  try {
    console.log('Adding service columns to quotations table...');
    
    await pool.query(`
      ALTER TABLE quotations 
      ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS service_id VARCHAR(10),
      ADD COLUMN IF NOT EXISTS service_details JSONB;
    `);
    
    console.log('✅ Columns added successfully!');
    
    // Verify columns exist
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quotations' 
      AND column_name IN ('service_type', 'service_id', 'service_details')
      ORDER BY column_name;
    `);
    
    console.log('\nVerified columns:');
    result.rows.forEach(row => console.log(`  - ${row.column_name}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addColumns();

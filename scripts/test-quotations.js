// Test quotations table
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testQuotations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🧪 Testing Quotations System...\n');

    // Check table exists
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'quotations'
      ORDER BY ordinal_position
      LIMIT 10;
    `);

    console.log('✅ Quotations table exists with columns:');
    tableCheck.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    // Check current data
    const count = await pool.query('SELECT COUNT(*) FROM quotations');
    console.log(`\n📊 Total quotations: ${count.rows[0].count}`);

    // List recent quotations
    if (count.rows[0].count > 0) {
      const recent = await pool.query(`
        SELECT quotation_number, customer_name, tour_name, status, total_amount, currency, created_at
        FROM quotations
        ORDER BY created_at DESC
        LIMIT 5;
      `);

      console.log('\n📝 Recent quotations:');
      recent.rows.forEach(q => {
        console.log(`   ${q.quotation_number}: ${q.customer_name} - ${q.tour_name}`);
        console.log(`      Status: ${q.status} | Amount: ${q.currency} ${q.total_amount} | Created: ${new Date(q.created_at).toLocaleDateString()}`);
      });
    }

    console.log('\n✅ Quotations system is ready!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testQuotations();

// Script to deploy quotations schema to Neon database
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function deploySchema() {
  console.log('\n🚀 Deploying Quotations Schema to Neon Database...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'quotations-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL file loaded:', sqlPath);
    console.log('📊 SQL length:', sql.length, 'characters\n');

    // Execute SQL
    console.log('⚙️  Executing SQL...');
    await pool.query(sql);

    console.log('✅ Schema deployed successfully!\n');

    // Verify deployment
    console.log('🔍 Verifying deployment...');
    const result = await pool.query(`
      SELECT COUNT(*) as count FROM quotations;
    `);

    console.log('✅ Quotations table exists!');
    console.log('📊 Current quotation count:', result.rows[0].count);

    // Check for sample data
    if (result.rows[0].count > 0) {
      const sample = await pool.query(`
        SELECT quotation_number, customer_name, tour_name, status
        FROM quotations
        ORDER BY created_at DESC
        LIMIT 3;
      `);

      console.log('\n📝 Sample quotations:');
      sample.rows.forEach(row => {
        console.log(`   - ${row.quotation_number}: ${row.customer_name} - ${row.tour_name} [${row.status}]`);
      });
    }

    console.log('\n✨ Database schema deployment complete!\n');

  } catch (error) {
    console.error('❌ Error deploying schema:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

deploySchema();

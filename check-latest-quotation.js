const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_CA8F0ZVzxgsj@ep-dry-cake-a1u1pa4b-pooler.ap-southeast-1.aws.neon.tech/zamzamtours?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    const result = await pool.query('SELECT quotation_number, vehicle_image_urls FROM quotations WHERE quotation_number = $1', ['ZZT-2026-0038']);
    if (result.rows.length > 0) {
      console.log('✅ Quotation ZZT-2026-0038:');
      console.log('vehicle_image_urls:', result.rows[0].vehicle_image_urls);
    } else {
      console.log('❌ Quotation not found');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

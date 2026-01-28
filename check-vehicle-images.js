const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CA8F0ZVzxgsj@ep-dry-cake-a1u1pa4b-pooler.ap-southeast-1.aws.neon.tech/zamzamtours?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    const result = await pool.query(
      'SELECT quotation_number, vehicle_image_urls, service_type FROM quotations WHERE quotation_number = $1',
      ['ZZT-2026-0037']
    );
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log('Quotation:', row.quotation_number);
      console.log('Service Type:', row.service_type);
      console.log('Vehicle Image URLs (raw):', row.vehicle_image_urls);
      console.log('Vehicle Image URLs (type):', typeof row.vehicle_image_urls);
    } else {
      console.log('Quotation not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

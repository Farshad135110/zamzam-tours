// Test script to verify vehicle images are being saved correctly

const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CA8F0ZVzxgsj@ep-dry-cake-a1u1pa4b-pooler.ap-southeast-1.aws.neon.tech/zamzamtours?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    // Get the latest vehicle quotations
    const result = await pool.query(
      'SELECT quotation_number, service_type, vehicle_image_urls FROM quotations WHERE service_type = $1 ORDER BY created_at DESC LIMIT 5',
      ['vehicle']
    );
    
    console.log('Latest Vehicle Quotations:');
    console.log('==========================\n');
    
    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. Quotation: ${row.quotation_number}`);
      console.log(`   Service Type: ${row.service_type}`);
      console.log(`   Vehicle Images (raw): ${row.vehicle_image_urls || 'NULL'}`);
      
      if (row.vehicle_image_urls) {
        try {
          if (typeof row.vehicle_image_urls === 'string') {
            const parsed = JSON.parse(row.vehicle_image_urls);
            console.log(`   Parsed Images: ${Array.isArray(parsed) ? parsed.length + ' image(s)' : 'Invalid'}`);
            if (Array.isArray(parsed)) {
              parsed.forEach((url, i) => {
                console.log(`     [${i + 1}] ${url.substring(0, 60)}...`);
              });
            }
          } else if (Array.isArray(row.vehicle_image_urls)) {
            console.log(`   Images (array): ${row.vehicle_image_urls.length} image(s)`);
          }
        } catch (err) {
          console.log(`   Parse Error: ${err.message}`);
        }
      }
      console.log();
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

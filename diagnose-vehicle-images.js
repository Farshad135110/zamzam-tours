const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_CA8F0ZVzxgsj@ep-dry-cake-a1u1pa4b-pooler.ap-southeast-1.aws.neon.tech/zamzamtours?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    // Get the latest quotations
    const result = await pool.query(
      'SELECT quotation_number, service_type, vehicle_image_urls, created_at FROM quotations ORDER BY created_at DESC LIMIT 10'
    );
    
    console.log('\n📊 Latest 10 Quotations:\n');
    
    result.rows.forEach((row, idx) => {
      const createdTime = new Date(row.created_at).toLocaleString();
      console.log(`${idx + 1}. ${row.quotation_number} (${row.service_type}) - ${createdTime}`);
      console.log(`   Raw vehicle_image_urls: ${row.vehicle_image_urls ? '✅ EXISTS' : '❌ NULL'}`);
      
      if (row.vehicle_image_urls) {
        console.log(`   Raw value: ${typeof row.vehicle_image_urls === 'string' ? 'STRING' : typeof row.vehicle_image_urls}`);
        if (typeof row.vehicle_image_urls === 'string') {
          try {
            const parsed = JSON.parse(row.vehicle_image_urls);
            console.log(`   ✅ Parsed as ${Array.isArray(parsed) ? 'ARRAY' : 'OBJECT'} with ${Array.isArray(parsed) ? parsed.length : 'unknown'} items`);
            if (Array.isArray(parsed)) {
              parsed.forEach((url, i) => {
                console.log(`      [${i + 1}] ${url.substring(0, 80)}...`);
              });
            }
          } catch (e) {
            console.log(`   ❌ JSON Parse Error: ${e.message}`);
            console.log(`   Content: ${row.vehicle_image_urls.substring(0, 100)}`);
          }
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

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkAvailability() {
  try {
    const res = await pool.query('SELECT vehicle_id, vehicle_name, available_for FROM vehicle ORDER BY vehicle_id LIMIT 10');
    
    console.log('\n🚗 Vehicle Availability Types\n');
    console.log('='.repeat(70));
    
    res.rows.forEach(v => {
      console.log(`\n${v.vehicle_name} (${v.vehicle_id})`);
      console.log(`  Available for: ${v.available_for || '(not set)'}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('\n📋 Availability Type Meanings:\n');
    console.log('  • self-drive / self_drive: Customer drives the vehicle themselves');
    console.log('  • with-driver / with_driver: Vehicle comes with a professional driver');
    console.log('  • tour: Vehicle available for multi-day tour packages');
    console.log('  • airport-transfer: Available for airport pickup/drop services');
    console.log('  • all-island-transfer: Available for long-distance transfers\n');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkAvailability();

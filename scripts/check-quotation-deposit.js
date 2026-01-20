const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDeposit() {
  try {
    // Get the most recent quotations
    const res = await pool.query(`
      SELECT 
        quotation_number,
        tour_name,
        total_amount,
        deposit_percentage,
        deposit_amount,
        balance_amount,
        created_at
      FROM quotations 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📋 Recent Quotations - Deposit Percentages\n');
    console.log('='.repeat(80));
    
    res.rows.forEach((q, idx) => {
      console.log(`\n${idx + 1}. ${q.quotation_number} - ${q.tour_name}`);
      console.log(`   Total: ${q.total_amount}`);
      console.log(`   Deposit %: ${q.deposit_percentage}%`);
      console.log(`   Deposit Amount: ${q.deposit_amount}`);
      console.log(`   Balance Amount: ${q.balance_amount}`);
      
      // Verify the calculation
      const expectedDeposit = (parseFloat(q.total_amount) * q.deposit_percentage / 100).toFixed(2);
      const expectedBalance = (parseFloat(q.total_amount) - expectedDeposit).toFixed(2);
      const actualDeposit = parseFloat(q.deposit_amount).toFixed(2);
      const actualBalance = parseFloat(q.balance_amount).toFixed(2);
      
      if (expectedDeposit === actualDeposit && expectedBalance === actualBalance) {
        console.log(`   ✅ Calculations are correct`);
      } else {
        console.log(`   ❌ MISMATCH!`);
        console.log(`   Expected Deposit: ${expectedDeposit} (got ${actualDeposit})`);
        console.log(`   Expected Balance: ${expectedBalance} (got ${actualBalance})`);
      }
      console.log(`   Created: ${new Date(q.created_at).toLocaleString()}`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkDeposit();

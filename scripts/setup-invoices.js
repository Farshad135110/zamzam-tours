// Script to create invoices table in the database
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createInvoicesTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating invoices table...');
    
    await client.query(`
      -- Invoices Schema
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        quotation_id INTEGER NOT NULL REFERENCES quotations(quotation_id) ON DELETE RESTRICT,
        quotation_number VARCHAR(50) NOT NULL,
        
        -- Customer Information
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        customer_country VARCHAR(100),
        
        -- Payment Information
        payment_type VARCHAR(50) NOT NULL,
        payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        payment_reference VARCHAR(255),
        
        -- Pricing Information
        subtotal DECIMAL(10, 2) NOT NULL,
        deposit_percentage INTEGER DEFAULT 30,
        deposit_amount DECIMAL(10, 2) NOT NULL,
        remaining_amount DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        paid_amount DECIMAL(10, 2) NOT NULL,
        
        -- Service Details
        service_type VARCHAR(50) NOT NULL,
        service_id VARCHAR(50),
        service_details JSONB NOT NULL,
        
        -- Dates
        service_start_date DATE NOT NULL,
        service_end_date DATE,
        
        -- Invoice Status
        invoice_status VARCHAR(50) DEFAULT 'paid',
        
        -- Email Tracking
        email_sent BOOLEAN DEFAULT FALSE,
        email_sent_at TIMESTAMP,
        
        -- Metadata
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255)
      );
    `);
    
    console.log('✅ Invoices table created successfully');
    
    // Create indexes
    console.log('Creating indexes...');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
      CREATE INDEX IF NOT EXISTS idx_invoices_quotation_id ON invoices(quotation_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
      CREATE INDEX IF NOT EXISTS idx_invoices_payment_date ON invoices(payment_date);
    `);
    
    console.log('✅ Indexes created successfully');
    
    // Create update trigger function
    console.log('Creating update trigger...');
    
    await client.query(`
      CREATE OR REPLACE FUNCTION update_invoice_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_invoice_timestamp ON invoices;
      CREATE TRIGGER trigger_update_invoice_timestamp
      BEFORE UPDATE ON invoices
      FOR EACH ROW
      EXECUTE FUNCTION update_invoice_updated_at();
    `);
    
    console.log('✅ Trigger created successfully');
    
    // Check table exists
    const checkResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'invoices'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Invoices table structure:');
    checkResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    console.log('\n✅ Invoice system database setup complete!');
    
  } catch (error) {
    console.error('❌ Error creating invoices table:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createInvoicesTable();

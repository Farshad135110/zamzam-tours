-- Invoices Schema
-- This table stores invoice information for quotations that have been paid

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
  payment_type VARCHAR(50) NOT NULL, -- cash, bank-transfer, card, online
  payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_reference VARCHAR(255), -- Bank reference, transaction ID, etc.
  
  -- Pricing Information
  subtotal DECIMAL(10, 2) NOT NULL,
  deposit_percentage INTEGER DEFAULT 30,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  remaining_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) NOT NULL,
  
  -- Service Details (copied from quotation for historical record)
  service_type VARCHAR(50) NOT NULL,
  service_id VARCHAR(50),
  service_details JSONB NOT NULL,
  
  -- Dates
  service_start_date DATE NOT NULL,
  service_end_date DATE,
  
  -- Invoice Status
  invoice_status VARCHAR(50) DEFAULT 'paid', -- paid, partial, refunded
  
  -- Email Tracking
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_quotation_id ON invoices(quotation_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_date ON invoices(payment_date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_invoice_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_timestamp
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoice_updated_at();

-- Sample data comment (DO NOT execute in production)
-- INSERT INTO invoices (invoice_number, quotation_id, quotation_number, customer_name, customer_email, 
--   payment_type, subtotal, deposit_amount, remaining_amount, total_amount, paid_amount,
--   service_type, service_details, service_start_date)
-- VALUES 
-- ('INV-2026-0001', 1, 'QUO-2026-0001', 'John Doe', 'john@example.com', 
--   'bank-transfer', 1000.00, 300.00, 700.00, 1000.00, 300.00,
--   'tour', '{"package_name": "Golden Triangle Tour"}', '2026-02-15');

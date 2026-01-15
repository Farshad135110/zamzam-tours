-- Quotations Table for Tour Booking Estimates
-- Similar to car rental booking estimate system

CREATE TABLE IF NOT EXISTS quotations (
    quotation_id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(20) UNIQUE NOT NULL, -- Format: ZZT-2026-0001
    
    -- Customer Information
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_country VARCHAR(50),
    customer_address TEXT,
    
    -- Tour Details
    package_id VARCHAR(10) REFERENCES package(package_id),
    tour_name VARCHAR(200) NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    
    -- Service Details (JSON) - stores full tour/vehicle/hotel details
    service_type VARCHAR(50), -- tour, vehicle, hotel, airport-transfer, all-island-transfer
    service_id VARCHAR(10), -- ID from package, vehicle, or hotel table
    service_details JSONB, -- Full service details including itinerary, images, facilities
    
    -- Passenger Information
    num_adults INTEGER DEFAULT 1,
    num_children INTEGER DEFAULT 0,
    num_infants INTEGER DEFAULT 0,
    
    -- Pricing Breakdown
    base_price DECIMAL(10,2) NOT NULL,
    accommodation_type VARCHAR(50) DEFAULT 'standard', -- standard, deluxe, luxury
    accommodation_upgrade DECIMAL(10,2) DEFAULT 0,
    single_room_supplement DECIMAL(10,2) DEFAULT 0,
    additional_excursions DECIMAL(10,2) DEFAULT 0,
    entry_fees DECIMAL(10,2) DEFAULT 0,
    vehicle_upgrade DECIMAL(10,2) DEFAULT 0,
    guide_fees DECIMAL(10,2) DEFAULT 0,
    
    -- Discount & Total
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_reason VARCHAR(100),
    subtotal DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD', -- USD, EUR, LKR, GBP
    
    -- Payment Terms
    deposit_percentage INTEGER DEFAULT 30,
    deposit_amount DECIMAL(10,2),
    balance_amount DECIMAL(10,2),
    deposit_due_date DATE,
    balance_due_date DATE,
    
    -- Status Management
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, viewed, accepted, declined, expired, converted
    valid_until DATE,
    
    -- Services & Customization
    included_services TEXT[], -- Array of included services
    excluded_services TEXT[], -- Array of excluded services
    custom_itinerary TEXT, -- JSON or text format
    special_requests TEXT,
    admin_notes TEXT,
    
    -- Tracking & Analytics
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    first_viewed_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    accepted_at TIMESTAMP,
    declined_at TIMESTAMP,
    declined_reason TEXT,
    converted_to_booking_id INTEGER, -- Reference to tour_booking if converted
    
    -- Source & Attribution
    source VARCHAR(50), -- website, email, phone, whatsapp, referral
    referral_source VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Admin Management
    created_by VARCHAR(50), -- Admin user who created it
    last_modified_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_quotations_number ON quotations(quotation_number);
CREATE INDEX idx_quotations_email ON quotations(customer_email);
CREATE INDEX idx_quotations_phone ON quotations(customer_phone);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_dates ON quotations(start_date, end_date);
CREATE INDEX idx_quotations_created ON quotations(created_at);
CREATE INDEX idx_quotations_package ON quotations(package_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quotations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER quotations_updated_at_trigger
    BEFORE UPDATE ON quotations
    FOR EACH ROW
    EXECUTE FUNCTION update_quotations_updated_at();

-- Function to generate quotation number
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS VARCHAR AS $$
DECLARE
    year_part VARCHAR(4);
    seq_num INTEGER;
    new_number VARCHAR(20);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(quotation_number FROM 10) AS INTEGER)
    ), 0) + 1
    INTO seq_num
    FROM quotations
    WHERE quotation_number LIKE 'ZZT-' || year_part || '-%';
    
    -- Format: ZZT-2026-0001
    new_number := 'ZZT-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO quotations (
    quotation_number,
    customer_name,
    customer_email,
    customer_phone,
    tour_name,
    start_date,
    end_date,
    duration_days,
    num_adults,
    num_children,
    base_price,
    subtotal,
    total_amount,
    deposit_amount,
    balance_amount,
    valid_until,
    created_by
) VALUES (
    'ZZT-2026-0001',
    'John Smith',
    'john.smith@email.com',
    '+1-555-0123',
    'Cultural Triangle Explorer - 5 Days',
    '2026-03-15',
    '2026-03-19',
    5,
    2,
    0,
    600.00,
    1200.00,
    1200.00,
    360.00,
    840.00,
    '2026-02-15',
    'admin'
);

-- Comments for documentation
COMMENT ON TABLE quotations IS 'Tour booking quotations/estimates for customer inquiries';
COMMENT ON COLUMN quotations.quotation_number IS 'Unique quotation identifier in format ZZT-YYYY-NNNN';
COMMENT ON COLUMN quotations.status IS 'Current status: draft, sent, viewed, accepted, declined, expired, converted';
COMMENT ON COLUMN quotations.valid_until IS 'Quotation expiry date (typically 14 days from creation)';
COMMENT ON COLUMN quotations.deposit_percentage IS 'Percentage of total required as deposit (default 30%)';

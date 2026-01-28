-- One-Time Tours Table
-- For tours created during quotation creation that are not saved as packages

CREATE TABLE IF NOT EXISTS one_time_tours (
    tour_id VARCHAR(10) PRIMARY KEY,
    tour_name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    image VARCHAR(255),
    highlights TEXT,
    includings TEXT,
    itinerary JSONB,
    days INTEGER,
    nights INTEGER,
    quotation_id INTEGER REFERENCES quotations(quotation_id) ON DELETE CASCADE,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_one_time_tours_quotation ON one_time_tours(quotation_id);
CREATE INDEX IF NOT EXISTS idx_one_time_tours_created_at ON one_time_tours(created_at DESC);

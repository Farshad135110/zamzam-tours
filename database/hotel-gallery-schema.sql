-- Hotel Gallery Table
-- This table stores multiple images for each hotel

CREATE TABLE IF NOT EXISTS hotel_gallery (
    gallery_id SERIAL PRIMARY KEY,
    hotel_id VARCHAR(10) NOT NULL REFERENCES hotel(hotel_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_hotel_gallery_hotel_id ON hotel_gallery(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_gallery_order ON hotel_gallery(hotel_id, display_order);

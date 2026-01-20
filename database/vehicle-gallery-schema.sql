-- Vehicle Gallery Schema
-- Multiple images per vehicle

CREATE TABLE IF NOT EXISTS vehicle_images (
    image_id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(10) NOT NULL REFERENCES vehicle(vehicle_id) ON UPDATE CASCADE ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_primary ON vehicle_images(vehicle_id, is_primary);

-- Sample comment for migration:
-- After running this schema, you can migrate existing vehicle images:
-- INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order)
-- SELECT vehicle_id, image, true, 1 FROM vehicle WHERE image IS NOT NULL AND image != '';

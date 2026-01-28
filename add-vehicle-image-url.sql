-- Add vehicle_image_url column to quotations table
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS vehicle_image_url TEXT;

-- Comment for documentation
COMMENT ON COLUMN quotations.vehicle_image_url IS 'Custom vehicle image URL for car rentals (e.g., different color/vehicle than the default package image)';

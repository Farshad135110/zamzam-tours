-- Add days and itinerary columns to package table
-- Run this SQL in your PostgreSQL database

ALTER TABLE package 
ADD COLUMN IF NOT EXISTS days INTEGER,
ADD COLUMN IF NOT EXISTS itinerary TEXT;

-- Optional: Add a comment to describe the columns
COMMENT ON COLUMN package.days IS 'Number of days for the tour package';
COMMENT ON COLUMN package.itinerary IS 'JSON string containing day-by-day itinerary details';

-- Add itinerary and days fields to package table
-- This allows tour packages to store full day-by-day itineraries

ALTER TABLE package 
ADD COLUMN IF NOT EXISTS days INTEGER,
ADD COLUMN IF NOT EXISTS itinerary JSONB;

COMMENT ON COLUMN package.days IS 'Number of days for the tour package';
COMMENT ON COLUMN package.itinerary IS 'Day-by-day itinerary with activities and images stored as JSON';

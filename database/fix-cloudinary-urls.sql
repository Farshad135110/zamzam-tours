-- Fix incorrect Cloudinary cloud names in database
-- Replace dhfqwxyb4 with dhqhxma30

-- Update gallery_images table
UPDATE gallery_images 
SET image_url = REPLACE(image_url, 'dhfqwxyb4', 'dhqhxma30')
WHERE image_url LIKE '%dhfqwxyb4%';

-- Verify the update
SELECT image_id, title, image_url FROM gallery_images WHERE is_active = true ORDER BY display_order;

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
    image_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(300),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_gallery_active ON gallery_images(is_active);
CREATE INDEX idx_gallery_order ON gallery_images(display_order);

-- Insert existing gallery images
INSERT INTO gallery_images (title, location, image_url, alt_text, display_order, is_active) VALUES
('Sigiriya Sunrise', 'Central Province', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg', 'Sigiriya Rock at sunrise', 1, true),
('Sacred Temple', 'Kandy', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454466/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_tvflxt.jpg', 'Kandy Temple', 2, true),
('Nine Arch Bridge', 'Ella', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453781/adam-vandermeer-Dw9dWTzzsUE-unsplash_l49hhe.jpg', 'Nine Arch Bridge in Ella', 3, true),
('Galle Fort Sunset', 'Galle', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453796/chathura-indika-LAj-XlHP6Rs-unsplash_o7mzbc.jpg', 'Galle Fort during sunset', 4, true),
('Mirissa Beach', 'Southern Coast', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454382/siarhei-palishchuk-hgiby6qxvpc-unsplash_prnosl.jpg', 'Mirissa Beach coastline', 5, true),
('Yala Wildlife', 'Yala National Park', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453757/gemmmm-FRTpkBIi-1Y-unsplash_iggwsm.jpg', 'Leopard in Yala National Park', 6, true),
('Tea Country', 'Nuwara Eliya', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453797/anton-lecock-TPtaNsBOW9Q-unsplash_g0htag.jpg', 'Tea plantations in hill country', 7, true),
('Arugam Bay Waves', 'East Coast', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453785/udara-karunarathna-LfUJO4whcSU-unsplash_xnxl7h.jpg', 'Surfing at Arugam Bay', 8, true),
('Trincomalee Beaches', 'East Coast', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453771/claus-giering-YmcSXWcmh6w-unsplash_zw66ck.jpg', 'Pristine beach in Trincomalee', 9, true),
('Mountain Railway', 'Hill Country', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453710/train-journey.jpg', 'Scenic train journey', 10, true),
('Polonnaruwa', 'Cultural Triangle', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454341/birendra-padmaperuma-jB7TbGrC1xM-unsplash_qcpkau.jpg', 'Polonnaruwa ruins', 11, true),
('Dambulla Golden Temple', 'Dambulla', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861700/agnieszka-stankiewicz-OMgi4DfiO3c-unsplash_dfa3pd.jpg', 'Dambulla cave temples', 12, true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gallery_updated_at_trigger
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_gallery_updated_at();

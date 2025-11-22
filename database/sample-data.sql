-- ZamZam Tours Sample Data
-- Insert this AFTER running schema.sql

-- Insert package data
INSERT INTO package (package_id, package_name, description, price, image, highlights, includings) VALUES
('P001', 'Cultural Heritage Tour', 'Explore Sri Lanka''s rich cultural heritage including ancient cities, UNESCO sites, and historical temples', 299.99, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000001/cultural-tour.jpg', 'Sigiriya Rock, Dambulla Cave Temple, Ancient City of Polonnaruwa, Temple of the Tooth', 'Professional guide, AC transport, entrance fees, lunch, bottled water'),
('P002', 'Beach Paradise Package', 'Relax on pristine beaches and enjoy water sports in beautiful coastal areas', 249.99, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000002/beach-tour.jpg', 'Unawatuna Beach, Mirissa Whale Watching, Hikkaduwa Snorkeling, Galle Fort', 'Transport, guide, water sports equipment, seafood lunch, refreshments'),
('P003', 'Hill Country Adventure', 'Experience the cool climate and tea plantations of Sri Lanka''s central highlands', 279.99, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000003/hill-country.jpg', 'Nuwara Eliya, Tea factory visit, Horton Plains, Gregory Lake, Victoria Park', 'Guide, transport, tea tasting, breakfast and lunch, hotel pickup'),
('P004', 'Wildlife Safari', 'Discover Sri Lanka''s amazing wildlife in national parks and nature reserves', 349.99, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000004/wildlife-safari.jpg', 'Yala National Park, Udawalawe Elephant Transit, Leopard spotting, Bird watching', 'Jeep safari, experienced tracker, park fees, picnic lunch, binoculars'),
('P005', 'Adventure Sports Package', 'Thrilling activities for adventure seekers including rafting and hiking', 329.99, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000005/adventure.jpg', 'White water rafting, Ella Rock hiking, Zip lining, Camping', 'All equipment, safety gear, instructor, meals, transport');

-- Insert gallery data
INSERT INTO gallery (gallery_id, caption, image_link) VALUES
('G001', 'Sigiriya Rock Fortress at Sunset', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000011/sigiriya.jpg'),
('G002', 'Temple of the Tooth - Kandy', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000012/tooth-temple.jpg'),
('G003', 'Galle Fort Historic Walls', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000013/galle-fort.jpg'),
('G004', 'Mirissa Beach Paradise', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000014/mirissa-beach.jpg'),
('G005', 'Tea Plantations Nuwara Eliya', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000015/tea-plantation.jpg'),
('G006', 'Wild Elephant - Yala National Park', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000016/elephant-yala.jpg'),
('G007', 'Nine Arch Bridge - Ella', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000017/nine-arch-bridge.jpg'),
('G008', 'Traditional Kandyan Dance Performance', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000018/kandyan-dance.jpg');

-- Insert feedback data
INSERT INTO feedback (feedback_id, name, country, review, rating, image) VALUES
('F001', 'John Smith', 'USA', 'Amazing experience! The tour was well organized and the guides were knowledgeable. We visited all the major cultural sites and learned so much about Sri Lankan history. Highly recommend ZamZam Tours!', 5, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000021/customer1.jpg'),
('F002', 'Sarah Johnson', 'UK', 'Beautiful country and excellent service. Our driver was punctual, friendly and very informative. The hotels were clean and comfortable. Had a wonderful time exploring Sri Lanka with ZamZam Tours!', 5, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000022/customer2.jpg'),
('F003', 'Michael Brown', 'Australia', 'Great value for money. The wildlife safari was the highlight of our trip. We saw elephants, leopards, and countless birds. The guide was fantastic and very knowledgeable about the animals.', 4, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000023/customer3.jpg'),
('F004', 'Emma Wilson', 'Canada', 'Perfect honeymoon destination! ZamZam Tours made everything so easy and stress-free. The beach package was absolutely divine. Thank you for the memories!', 5, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000024/customer4.jpg'),
('F005', 'David Lee', 'Singapore', 'Professional service from start to finish. The hill country tour was breathtaking. The tea plantation visit was educational and the scenery was stunning. Will definitely book again!', 5, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000025/customer5.jpg'),
('F006', 'Maria Garcia', 'Spain', 'Excellent adventure sports package! The white water rafting was thrilling and the hiking in Ella was spectacular. Safety was a top priority which we really appreciated.', 4, NULL);

-- Insert hotel data
INSERT INTO hotel (hotel_id, hotel_name, location, price_range, image, facilities) VALUES
('H001', 'Cinnamon Grand Colombo', 'Colombo', '$150-300', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000031/cinnamon-grand.jpg', 'Infinity pool, Full-service spa, 5 restaurants, Fitness center, Free WiFi, Business center, 24hr room service'),
('H002', 'Jetwing Lighthouse', 'Galle', '$200-400', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000032/jetwing-lighthouse.jpg', 'Beachfront location, Outdoor pool, Spa services, Restaurant & bar, Ocean view rooms, Free WiFi'),
('H003', 'Heritance Kandalama', 'Dambulla', '$180-350', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000033/heritance-kandalama.jpg', 'Nature reserve views, Infinity pool overlooking lake, Award-winning spa, Multiple dining options, Eco-friendly design'),
('H004', 'Shangri-La Colombo', 'Colombo', '$200-450', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000034/shangri-la.jpg', 'Luxury suites, Rooftop bar, Multiple pools, CHI spa, 5 restaurants, Ocean views, Gym'),
('H005', 'Amanwella Resort', 'Tangalle', '$400-800', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000035/amanwella.jpg', 'Private beach, Luxury villas, Infinity pool, Fine dining, Spa, Yoga pavilion, Butler service'),
('H006', 'Earl''s Regency Hotel', 'Kandy', '$100-200', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000036/earls-regency.jpg', 'Mountain views, Pool, Restaurant, Bar, Gym, Free WiFi, Conference facilities'),
('H007', 'Cinnamon Citadel Kandy', 'Kandy', '$120-250', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000037/cinnamon-citadel.jpg', 'River views, Pool, Spa, Multiple restaurants, Cultural shows, Free WiFi'),
('H008', 'Anantara Peace Haven', 'Tangalle', '$250-500', 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000038/anantara.jpg', 'Beachfront resort, Luxury villas, Spa sanctuary, Infinity pool, Fine dining, Water sports');

-- Insert vehicle data
INSERT INTO vehicle (vehicle_id, vehicle_name, vehicle_type, description, km_per_day, price_per_day, extra_charge_per_km, image, capacity, available_for) VALUES
('V001', 'Toyota KDH Van', 'Van', 'Comfortable air-conditioned van perfect for family trips and group travel. Features reclining seats, ample luggage space, and entertainment system.', 150, 75.00, 0.50, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000041/kdh-van.jpg', 8, 'Tours, Airport transfers, Group travel'),
('V002', 'Toyota Prius', 'Car', 'Hybrid sedan for comfortable and eco-friendly city travel. Fuel efficient with modern amenities and smooth ride.', 100, 45.00, 0.40, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000042/prius.jpg', 4, 'City tours, Airport transfers, Business travel'),
('V003', 'Luxury Coach', 'Bus', 'Large luxury coach ideal for big groups. Features reclining seats, AC, entertainment system, and restroom facilities.', 200, 120.00, 0.60, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000043/luxury-coach.jpg', 35, 'Group tours, Corporate events'),
('V004', 'Toyota Hiace', 'Van', 'Reliable and spacious van for medium-sized groups. Air-conditioned with comfortable seating and good luggage capacity.', 140, 65.00, 0.45, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000044/hiace.jpg', 14, 'Tours, Airport transfers, Events'),
('V005', 'Mercedes-Benz E-Class', 'Luxury Car', 'Premium luxury sedan for executive travel. Features leather interior, advanced safety, and ultimate comfort.', 120, 95.00, 0.70, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000045/mercedes.jpg', 4, 'Executive travel, VIP transfers'),
('V006', 'Nissan Caravan', 'Van', 'Economical van option for budget-conscious travelers. Reliable and comfortable with air conditioning.', 130, 55.00, 0.35, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000046/caravan.jpg', 10, 'Budget tours, Group travel'),
('V007', 'Land Cruiser Prado', 'SUV', 'Robust 4WD SUV perfect for adventure tours and rough terrain. Spacious and comfortable with powerful performance.', 120, 110.00, 0.75, 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1730000047/prado.jpg', 7, 'Safari tours, Adventure trips, Hill country');

-- Insert airport pickup data
INSERT INTO airport_pickup (airportpickup_id, type, pickup_from, airport, drop_off, no_of_passengers, pickup_time, vehicle_id, note, price) VALUES
('AP001', '1 way', 'BIA - Bandaranaike International Airport', 'Colombo Airport', 'Cinnamon Grand Hotel, Colombo', 4, '2025-11-15 14:30:00', 'V002', 'Flight arrives at 2:00 PM', 35.00),
('AP002', '2 way', 'BIA - Bandaranaike International Airport', 'Colombo Airport', 'Galle Face Hotel, Colombo', 2, '2025-11-20 10:00:00', 'V005', 'VIP transfer required', 150.00),
('AP003', '1 way', 'BIA - Bandaranaike International Airport', 'Colombo Airport', 'Kandy City Hotel', 6, '2025-11-18 16:45:00', 'V001', 'Family with children', 85.00);

-- Insert tour booking data
INSERT INTO tour_booking (tour_booking_id, package_id, name, email, phone_no, no_of_travellers, starting_date, pickup_location, special_requirements) VALUES
('TB001', 'P001', 'Robert Anderson', 'robert.anderson@email.com', '+1-555-0101', 4, '2025-12-01', 'Cinnamon Grand Hotel, Colombo', 'Need wheelchair accessible vehicle'),
('TB002', 'P002', 'Jennifer Martinez', 'jennifer.m@email.com', '+44-7700-900123', 2, '2025-12-05', 'Galle Fort Hotel', 'Vegetarian meals preferred'),
('TB003', 'P004', 'Thomas Chen', 'thomas.chen@email.com', '+65-8888-1234', 5, '2025-12-10', 'Hilton Colombo', 'Photography equipment allowed'),
('TB004', 'P003', 'Lisa Thompson', 'lisa.t@email.com', '+61-4-1234-5678', 3, '2025-12-15', 'Shangri-La Colombo', 'Children ages 8, 10, and 12');

-- Insert vehicle booking data
INSERT INTO vehicle_booking (vehicle_booking_id, rental_type, customer_type, name, email, phone_no, pickup_location, pickup_date, return_date, no_of_dates, special_request, vehicle_id) VALUES
('VB001', 'Self Drive', 'Tourist', 'James Wilson', 'james.w@email.com', '+1-555-0202', 'Colombo Airport', '2025-11-25', '2025-11-30', 5, 'Need GPS navigation system', 'V002'),
('VB002', 'With Driver', 'Corporate', 'Sophie Laurent', 'sophie.l@company.com', '+33-6-1234-5678', 'Cinnamon Grand Hotel', '2025-12-01', '2025-12-05', 4, 'Business meetings in Colombo and Kandy', 'V005'),
('VB003', 'With Driver', 'Tourist', 'Ahmed Hassan', 'ahmed.h@email.com', '+971-50-123-4567', 'BIA Airport', '2025-12-08', '2025-12-15', 7, 'Family tour around the island', 'V001');

-- Insert hotel booking data
INSERT INTO hotel_booking (hotel_booking_id, hotel_id, name, email, phone_no, check_in, check_out, no_of_rooms, no_of_people) VALUES
('HB001', 'H001', 'Christopher Davis', 'chris.davis@email.com', '+1-555-0303', '2025-11-28', '2025-12-02', 2, 4),
('HB002', 'H005', 'Isabella Romano', 'isabella.r@email.com', '+39-333-123456', '2025-12-05', '2025-12-12', 1, 2),
('HB003', 'H003', 'William Zhang', 'william.z@email.com', '+86-138-123456', '2025-12-10', '2025-12-14', 3, 6),
('HB004', 'H007', 'Olivia Schmidt', 'olivia.s@email.com', '+49-170-123456', '2025-12-15', '2025-12-18', 1, 2),
('HB005', 'H002', 'Lucas Silva', 'lucas.silva@email.com', '+55-11-987654', '2025-12-20', '2025-12-25', 2, 3);

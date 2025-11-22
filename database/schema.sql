-- ZamZam Tours Database Schema
-- Clean version for Neon SQL Editor

-- Create custom type for pickup
CREATE TYPE pickup_type AS ENUM ('1 way', '2 way');

-- Package table
CREATE TABLE package (
    package_id VARCHAR(10) PRIMARY KEY,
    package_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2),
    image VARCHAR(255),
    highlights TEXT,
    includings TEXT
);

-- Gallery table
CREATE TABLE gallery (
    gallery_id VARCHAR(10) PRIMARY KEY,
    caption VARCHAR(255) NOT NULL,
    image_link VARCHAR(255) NOT NULL
);

-- Feedback table
CREATE TABLE feedback (
    feedback_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    review TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image TEXT
);

-- Hotel table
CREATE TABLE hotel (
    hotel_id VARCHAR(10) PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    price_range VARCHAR(50),
    image TEXT,
    facilities TEXT
);

-- Vehicle table
CREATE TABLE vehicle (
    vehicle_id VARCHAR(10) PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    description TEXT,
    km_per_day INTEGER,
    price_per_day NUMERIC(10,2),
    extra_charge_per_km NUMERIC(10,2),
    image TEXT,
    capacity INTEGER,
    available_for VARCHAR(100)
);

-- Airport pickup table
CREATE TABLE IF NOT EXISTS airport_pickup (
    airportpickup_id VARCHAR(10) PRIMARY KEY,
    type public.pickup_type NOT NULL,
    pickup_from VARCHAR(255) NOT NULL,
    airport VARCHAR(255) NOT NULL,
    drop_off VARCHAR(255) NOT NULL,
    no_of_passengers INTEGER NOT NULL,
    pickup_time TIMESTAMP NOT NULL,
    vehicle_id VARCHAR(10) REFERENCES vehicle(vehicle_id) ON UPDATE CASCADE ON DELETE SET NULL,
    note TEXT,
    price NUMERIC(10,2) NOT NULL
);

-- Tour booking table
CREATE TABLE IF NOT EXISTS tour_booking (
    tour_booking_id VARCHAR(10) PRIMARY KEY,
    package_id VARCHAR(10) NOT NULL REFERENCES package(package_id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    no_of_travellers INTEGER NOT NULL,
    starting_date DATE NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    special_requirements TEXT
);

-- Vehicle booking table
CREATE TABLE IF NOT EXISTS vehicle_booking (
    vehicle_booking_id VARCHAR(10) PRIMARY KEY,
    rental_type VARCHAR(50) NOT NULL,
    customer_type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    no_of_dates INTEGER NOT NULL,
    special_request TEXT,
    vehicle_id VARCHAR(10) REFERENCES vehicle(vehicle_id)
);

-- Hotel booking table
CREATE TABLE IF NOT EXISTS hotel_booking (
    hotel_booking_id VARCHAR(10) PRIMARY KEY,
    hotel_id VARCHAR(10) REFERENCES hotel(hotel_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    no_of_rooms INTEGER NOT NULL,
    no_of_people INTEGER NOT NULL
);

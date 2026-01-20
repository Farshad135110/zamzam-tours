/**
 * Test script to verify quotation services auto-fetch functionality
 * Run with: node scripts/test-quotation-services.js
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testQuotationServices() {
  console.log('🧪 Testing Quotation Services Auto-Fetch\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Fetch package services
    console.log('\n📦 Test 1: Package Services');
    console.log('-'.repeat(60));
    
    const packageResult = await pool.query(
      'SELECT package_id, package_name, includings FROM package LIMIT 1'
    );
    
    if (packageResult.rows.length > 0) {
      const pkg = packageResult.rows[0];
      console.log(`Package: ${pkg.package_name} (${pkg.package_id})`);
      console.log(`\nIncludings field:`);
      console.log(pkg.includings || '(empty)');
      
      if (pkg.includings) {
        const services = pkg.includings
          .split(/[,\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        console.log(`\nParsed services (${services.length}):`);
        services.forEach((service, idx) => {
          console.log(`  ${idx + 1}. ${service}`);
        });
      }
    } else {
      console.log('⚠️  No packages found in database');
    }
    
    // Test 2: Fetch vehicle services
    console.log('\n\n🚗 Test 2: Vehicle Services');
    console.log('-'.repeat(60));
    
    const vehicleResult = await pool.query(
      'SELECT vehicle_id, vehicle_name, vehicle_type, available_for FROM vehicle LIMIT 1'
    );
    
    if (vehicleResult.rows.length > 0) {
      const vehicle = vehicleResult.rows[0];
      console.log(`Vehicle: ${vehicle.vehicle_name} (${vehicle.vehicle_id})`);
      console.log(`Type: ${vehicle.vehicle_type}`);
      console.log(`Available for: ${vehicle.available_for || '(not specified)'}`);
      
      const vehicleServices = [
        `${vehicle.vehicle_name} - ${vehicle.vehicle_type}`,
        'Comprehensive Insurance Coverage',
        'Unlimited Mileage (within daily limit)',
        '24/7 Roadside Assistance',
        'Free Additional Driver',
        'GPS Navigation System',
        'Child Seat Available (on request)',
        'Airport Pickup & Drop-off'
      ];
      
      if (vehicle.available_for) {
        vehicleServices.push(`Available for: ${vehicle.available_for}`);
      }
      
      console.log(`\nGenerated services (${vehicleServices.length}):`);
      vehicleServices.forEach((service, idx) => {
        console.log(`  ${idx + 1}. ${service}`);
      });
    } else {
      console.log('⚠️  No vehicles found in database');
    }
    
    // Test 3: Fetch hotel services
    console.log('\n\n🏨 Test 3: Hotel Services');
    console.log('-'.repeat(60));
    
    const hotelResult = await pool.query(
      'SELECT hotel_id, hotel_name, facilities FROM hotel LIMIT 1'
    );
    
    if (hotelResult.rows.length > 0) {
      const hotel = hotelResult.rows[0];
      console.log(`Hotel: ${hotel.hotel_name} (${hotel.hotel_id})`);
      console.log(`\nFacilities field:`);
      console.log(hotel.facilities || '(empty)');
      
      let hotelServices = [];
      if (hotel.facilities) {
        hotelServices = hotel.facilities
          .split(/[,\n]/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        hotelServices.unshift('Daily Housekeeping');
        hotelServices.unshift('Complimentary Breakfast');
      } else {
        hotelServices = [
          'Complimentary Breakfast',
          'Daily Housekeeping',
          'Free WiFi',
          'Room Service',
          'Concierge Service'
        ];
      }
      
      console.log(`\nParsed services (${hotelServices.length}):`);
      hotelServices.forEach((service, idx) => {
        console.log(`  ${idx + 1}. ${service}`);
      });
    } else {
      console.log('⚠️  No hotels found in database');
    }
    
    // Test 4: Check existing quotations
    console.log('\n\n📋 Test 4: Existing Quotations');
    console.log('-'.repeat(60));
    
    const quotationResult = await pool.query(`
      SELECT 
        quotation_number,
        tour_name,
        service_type,
        included_services
      FROM quotations 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    if (quotationResult.rows.length > 0) {
      quotationResult.rows.forEach((quot, idx) => {
        console.log(`\n${idx + 1}. Quotation: ${quot.quotation_number}`);
        console.log(`   Tour: ${quot.tour_name}`);
        console.log(`   Type: ${quot.service_type || 'tour'}`);
        console.log(`   Services (${quot.included_services?.length || 0}):`);
        if (quot.included_services && quot.included_services.length > 0) {
          quot.included_services.forEach((service, sIdx) => {
            console.log(`     ${sIdx + 1}. ${service}`);
          });
        } else {
          console.log('     (no services)');
        }
      });
    } else {
      console.log('⚠️  No quotations found in database');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the test
testQuotationServices();

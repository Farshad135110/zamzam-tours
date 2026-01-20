# Quotation Services Auto-Fetch Implementation

## Overview
The quotation system now automatically fetches and populates services associated with tour packages, vehicle rentals, and hotel bookings. This ensures that quotations accurately reflect the services included with each offering.

## Changes Made

### 1. API Endpoint Updates (`/pages/api/quotations/index.ts`)

#### Tour Packages
- **Source Field**: `package.includings`
- **Logic**: When creating a quotation for a tour package, the system:
  1. Queries the `package` table using the `package_id` or `service_id`
  2. Extracts the `includings` field
  3. Parses it by splitting on commas or newlines
  4. Populates the `included_services` array in the quotation

#### Vehicle Rentals
- **Source**: Generated from vehicle details
- **Logic**: When creating a quotation for vehicle rental:
  1. Queries the `vehicle` table using the `service_id`
  2. Creates a standard set of vehicle rental services including:
     - Vehicle name and type
     - Comprehensive Insurance Coverage
     - Unlimited Mileage (within daily limit)
     - 24/7 Roadside Assistance
     - Free Additional Driver
     - GPS Navigation System
     - Child Seat Available (on request)
     - Airport Pickup & Drop-off
  3. Appends the `available_for` field if present

#### Hotel Bookings
- **Source Field**: `hotel.facilities`
- **Logic**: When creating a quotation for hotel booking:
  1. Queries the `hotel` table using the `service_id`
  2. Extracts the `facilities` field
  3. Parses it by splitting on commas or newlines
  4. Prepends standard hotel services:
     - Complimentary Breakfast
     - Daily Housekeeping
  5. Populates the `included_services` array

#### Fallback Behavior
If no services can be fetched or if the service type is unrecognized, the system uses default tour services:
- Private A/C Vehicle with English-speaking Driver
- Accommodation (Double/Twin Rooms)
- Daily Breakfast
- Airport Pickup & Drop-off
- All Fuel, Parking & Highway Charges
- Driver Accommodation & Meals
- Government Taxes

### 2. Admin Panel Updates (`/pages/admin/quotations.tsx`)

The admin quotation creation interface has been updated to:

1. **Tour Packages**: 
   - Changed from using `highlights` to `includings` field
   - Properly parses comma and newline-separated services

2. **Vehicle Rentals**:
   - Auto-generates standard vehicle rental services
   - Includes vehicle-specific details like name, type, and availability

3. **Hotel Bookings**:
   - Extracts services from hotel `facilities` field
   - Adds standard hotel services (breakfast, housekeeping)
   - Falls back to default services if facilities are not defined

## Data Flow

```
User creates quotation
    ↓
Selects service type (tour/vehicle/hotel)
    ↓
Selects specific service (package/vehicle/hotel ID)
    ↓
System queries relevant table
    ↓
Extracts service-specific fields
    ↓
Populates included_services array
    ↓
Stores in quotation record
    ↓
Displays in quotation view
```

## Database Schema Reference

### Package Table
```sql
CREATE TABLE package (
    package_id VARCHAR(10) PRIMARY KEY,
    package_name VARCHAR(100),
    includings TEXT,  -- ← Services source for tours
    ...
);
```

### Vehicle Table
```sql
CREATE TABLE vehicle (
    vehicle_id VARCHAR(10) PRIMARY KEY,
    vehicle_name VARCHAR(100),
    vehicle_type VARCHAR(50),
    available_for VARCHAR(100),  -- ← Additional info for services
    ...
);
```

### Hotel Table
```sql
CREATE TABLE hotel (
    hotel_id VARCHAR(10) PRIMARY KEY,
    hotel_name VARCHAR(100),
    facilities TEXT,  -- ← Services source for hotels
    ...
);
```

### Quotations Table
```sql
CREATE TABLE quotations (
    quotation_id SERIAL PRIMARY KEY,
    service_type VARCHAR(50),
    service_id VARCHAR(10),
    included_services TEXT[],  -- ← Auto-populated services
    ...
);
```

## Manual Override

Administrators can still manually specify services when creating a quotation by passing the `includedServices` array in the request body. This will override the automatic fetching.

Example:
```javascript
{
  serviceType: 'tour',
  serviceId: 'P001',
  includedServices: [
    'Custom Service 1',
    'Custom Service 2'
  ],
  // ... other fields
}
```

## Testing

To test the implementation:

1. **Create a tour quotation**: Verify services are fetched from `package.includings`
2. **Create a vehicle quotation**: Verify standard vehicle services are generated
3. **Create a hotel quotation**: Verify services are fetched from `hotel.facilities`
4. **View quotation**: Check that services appear in the "Services Included" section

## Benefits

1. **Consistency**: Services are always accurate and up-to-date with package/vehicle/hotel definitions
2. **Automation**: Reduces manual data entry and potential errors
3. **Maintainability**: Update services in one place (package/vehicle/hotel) and all quotations reflect changes
4. **Flexibility**: Still allows manual override when needed

## Future Enhancements

- Add excluded services auto-population
- Create service templates for different tour types
- Add service customization per quotation
- Implement service pricing breakdown

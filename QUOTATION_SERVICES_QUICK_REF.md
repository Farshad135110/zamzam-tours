# Quotation Services - Quick Reference Guide

## How Services Are Populated

### For Tour Packages
**Source**: `package.includings` field in database

**Format**: Text field with services separated by commas or newlines

**Example**:
```
Private air-conditioned car / family van
3–4 star hotel accommodation (half-board: breakfast & dinner)
All safari jeep rides (Udawalawe & Yala)
Entrance fees for all attractions
```

**To Update**: Edit the package in admin panel or directly in database

---

### For Vehicle Rentals
**Source**: Auto-generated based on vehicle details

**Standard Services**:
1. [Vehicle Name] - [Vehicle Type]
2. Comprehensive Insurance Coverage
3. Unlimited Mileage (within daily limit)
4. 24/7 Roadside Assistance
5. Free Additional Driver
6. GPS Navigation System
7. Child Seat Available (on request)
8. Airport Pickup & Drop-off
9. Available for: [vehicle availability options]

**To Customize**: Modify the service generation logic in `/pages/api/quotations/index.ts` lines 248-265

---

### For Hotel Bookings
**Source**: `hotel.facilities` field in database + standard services

**Standard Services Added**:
1. Complimentary Breakfast
2. Daily Housekeeping

**Plus**: All facilities from `hotel.facilities` field

**Example Output**:
```
Complimentary Breakfast
Daily Housekeeping
Free Wi-Fi
Pool
Restaurant
Spa Services
```

**To Update**: Edit the hotel in admin panel or directly in database

---

## Testing Your Changes

1. **View Test Results**:
   ```powershell
   cd 'c:\ZamZam tours\zamzam-tours'
   node scripts/test-quotation-services.js
   ```

2. **Create a New Quotation**:
   - Go to Admin Panel → Quotations
   - Click "Create New Quotation"
   - Select service type (Tour/Vehicle/Hotel)
   - Select a specific service
   - Services will auto-populate in the "Included Services" section

3. **Verify in Customer View**:
   - Open the quotation in customer view
   - Scroll to "Services Included" section
   - Verify all services from the package/vehicle/hotel appear

---

## Manual Override

To manually specify services when creating a quotation via API:

```javascript
POST /api/quotations
{
  "serviceType": "tour",
  "serviceId": "P001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "includedServices": [
    "Custom Service 1",
    "Custom Service 2",
    "Custom Service 3"
  ],
  // ... other required fields
}
```

The `includedServices` array will override auto-fetched services.

---

## Troubleshooting

### Services Not Showing
1. Check if the package/vehicle/hotel has the relevant field populated
2. Run the test script to verify data exists
3. Check browser console for errors when creating quotation
4. Verify the service_id matches an existing package/vehicle/hotel

### Wrong Services Appearing
1. Verify the correct service_type is set (tour/vehicle/hotel)
2. Check if includedServices was manually provided
3. Ensure the service_id corresponds to the correct service

### Services Need Updating
- **For Tours**: Update the `includings` field in the package table
- **For Vehicles**: Modify the auto-generation logic or provide custom services
- **For Hotels**: Update the `facilities` field in the hotel table

---

## Related Files

- **API Logic**: `/pages/api/quotations/index.ts` (lines 234-310)
- **Admin Panel**: `/pages/admin/quotations.tsx` (lines 140-220)
- **Customer View**: `/pages/quotation/[number].tsx` (lines 653-668)
- **Test Script**: `/scripts/test-quotation-services.js`
- **Documentation**: `/QUOTATION_SERVICES_AUTO_FETCH.md`

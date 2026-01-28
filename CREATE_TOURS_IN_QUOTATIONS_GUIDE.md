# Create Tours During Quotation - Feature Guide

## Overview
You can now create new tour packages or one-time tours directly while creating quotations, without needing to go to the tour packages admin section.

## How to Use

### Creating a Quotation with a New Tour

1. **Go to Admin → Quotations → Create New Quotation**

2. **Select Service Type**: Choose "Tour"

3. **In Step 2**, you'll see:
   - Dropdown to select existing tour packages
   - **➕ Create New Tour Package** button

4. **Click "Create New Tour Package"** button

5. **In the modal, choose how to save:**
   - **Save as Tour Package**: Reusable for future quotations
   - **Save as One-Time Tour**: Only for this quotation

### For Reusable Packages

1. Select **"Save as Tour Package"** radio option
2. Fill in the tour details:
   - Tour Name *
   - Description
   - Days & Nights
   - Price
   - Highlights
   - Included Services
3. Click **"Create Package"**
4. The new package will automatically be selected and appear in future tour selections

### For One-Time Tours

1. Select **"Save as One-Time Tour"** radio option
2. Fill in the same details
3. Click **"Create Tour"**
4. The tour is created and linked only to this quotation

## Database Structure

### New Table: `one_time_tours`
```sql
- tour_id (VARCHAR 10) - Primary key, format: OT00001
- tour_name (VARCHAR 100)
- description (TEXT)
- price (NUMERIC 10,2)
- image (VARCHAR 255)
- highlights (TEXT)
- includings (TEXT)
- itinerary (JSONB)
- days (INTEGER)
- nights (INTEGER)
- quotation_id (INTEGER) - Link to quotation
- created_by (VARCHAR 100)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Package Table (Existing)
- Remains unchanged
- New packages created via this feature go here

## API Endpoint

**POST `/api/tours/create`**

### Request Body
```json
{
  "tourName": "5-Day Western Circuit",
  "description": "Tour description",
  "price": 1500,
  "days": 5,
  "nights": 4,
  "highlights": "Sigiriya, Kandy, Ella",
  "includings": "Vehicle, Accommodation, Meals",
  "saveType": "package" | "one-time",
  "quotationId": 123,
  "createdBy": "admin"
}
```

### Response
```json
{
  "success": true,
  "message": "Tour package created successfully",
  "package": {
    "packageId": "PKG001",
    "packageName": "5-Day Western Circuit",
    "price": 1500
  }
}
```

## Features

✅ Create packages without leaving quotation form
✅ Reuse packages for multiple quotations
✅ Save one-time tours for specific quotations
✅ Both types have identical fields and structure
✅ Automatic selection after creation
✅ Proper error handling and validation

## Workflow

```
Create Quotation
    ↓
Select Tour Service Type
    ↓
    ├── Use Existing Package → Select from dropdown
    └── Create New → 
            ├── Save as Package → Available in future quotations
            └── Save as One-Time → Only for this quotation
```

## Notes

- One-time tours do NOT appear in the "Tour Packages" admin section
- One-time tours ARE linked to a specific quotation via `quotation_id`
- Packages are reusable across multiple quotations
- Both have the same fields for flexibility
- Tour creation happens via `/api/tours/create` endpoint

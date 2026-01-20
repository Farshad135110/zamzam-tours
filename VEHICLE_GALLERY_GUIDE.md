# Vehicle Multi-Image Gallery System

## Overview
Vehicles now support multiple images with primary image selection and display ordering.

## Database Setup

### 1. Run the SQL Schema
Execute this in your Supabase/Neon SQL Editor:

```sql
-- File: database/vehicle-gallery-schema.sql
CREATE TABLE IF NOT EXISTS vehicle_images (
    image_id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(10) NOT NULL REFERENCES vehicle(vehicle_id) ON UPDATE CASCADE ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_primary ON vehicle_images(vehicle_id, is_primary);
```

### 2. Migrate Existing Vehicle Images (Optional)
If you have existing vehicles with single images in the `image` column:

```sql
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order)
SELECT vehicle_id, image, true, 1 
FROM vehicle 
WHERE image IS NOT NULL AND image != '';
```

## Admin Interface

### Adding Multiple Images

1. **Go to Admin → Vehicles**
2. **Create/Edit a Vehicle**
3. **Primary Image Section**
   - Upload the main vehicle image (backward compatible with old system)
   
4. **Vehicle Gallery Section**
   - Click "Add Another Image" to upload additional images
   - Each image shows:
     - ⭐ Primary indicator (green)
     - ☆ Set as primary button (gray)
     - × Delete button (red)
   
5. **Managing Images**
   - Click ⭐/☆ to set any image as primary
   - Click × to remove an image
   - Primary image is automatically highlighted

### Image Display

- **Grid layout**: All images shown in responsive grid
- **Primary badge**: Green "Primary" label on main image
- **Order**: Primary image first, then by display_order

## API Endpoints

### Get Vehicle with Images
```
GET /api/vehicles
GET /api/vehicles/[id]
```
Response includes `images` array:
```json
{
  "vehicle_id": "V001",
  "vehicle_name": "Toyota Hiace",
  "image": "https://...",
  "images": [
    {
      "image_id": 1,
      "vehicle_id": "V001",
      "image_url": "https://...",
      "is_primary": true,
      "display_order": 1
    }
  ]
}
```

### Manage Vehicle Images
```
GET    /api/vehicles/[vehicleId]/images    - Get all images
POST   /api/vehicles/[vehicleId]/images    - Replace all images
DELETE /api/vehicles/[vehicleId]/images    - Delete all images
```

### Update Vehicle with Images
```
PUT /api/vehicles/[id]
```
Body:
```json
{
  "vehicle_name": "Updated Name",
  "images": [
    {
      "image_url": "https://cloudinary.com/...",
      "is_primary": true,
      "display_order": 1
    },
    {
      "image_url": "https://cloudinary.com/...",
      "is_primary": false,
      "display_order": 2
    }
  ]
}
```

## Frontend Usage

### Vehicle Interface
```typescript
interface VehicleImage {
  image_id?: number;
  vehicle_id?: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  image: string;          // Primary/fallback image
  images?: VehicleImage[]; // Gallery images
  // ... other fields
}
```

### Display Vehicle Images
```tsx
// Show primary image
<img src={vehicle.image} alt={vehicle.vehicle_name} />

// Show all gallery images
{vehicle.images?.map((img, index) => (
  <img 
    key={img.image_id || index}
    src={img.image_url} 
    alt={`${vehicle.vehicle_name} ${index + 1}`}
    className={img.is_primary ? 'primary' : ''}
  />
))}

// Get primary image from gallery
const primaryImage = vehicle.images?.find(img => img.is_primary);
const displayImage = primaryImage?.image_url || vehicle.image;
```

## Features

✅ **Multiple Images**: Upload unlimited images per vehicle
✅ **Primary Selection**: Mark one image as primary
✅ **Display Ordering**: Control image sequence
✅ **Easy Management**: Visual grid with controls
✅ **Backward Compatible**: Old `image` field still works
✅ **Auto-cleanup**: Images deleted when vehicle deleted
✅ **Cloudinary Integration**: Uses existing upload component

## Files Modified

- `database/vehicle-gallery-schema.sql` - New table schema
- `pages/admin/vehicles.tsx` - Admin UI with gallery
- `pages/api/vehicles/index.ts` - Create with images
- `pages/api/vehicles/[id].ts` - Update/delete with images
- `pages/api/vehicles/[vehicleId]/images.ts` - Image management API
- `lib/models/vehicleModel.ts` - Fetch images with vehicles
- `lib/controllers/vehicleController.ts` - No changes needed

## Migration Notes

1. Run `vehicle-gallery-schema.sql` in your database
2. Optionally migrate existing vehicle images
3. Deploy updated code
4. Test image upload/management in admin panel
5. Update frontend vehicle displays to use image gallery

## Future Enhancements

- [ ] Drag & drop reordering
- [ ] Bulk image upload
- [ ] Image cropping/editing
- [ ] Image descriptions/captions
- [ ] Public vehicle gallery view

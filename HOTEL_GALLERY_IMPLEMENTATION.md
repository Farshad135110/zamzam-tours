# Hotel Gallery Feature Implementation

## Database Schema
Created `hotel_gallery` table in `database/hotel-gallery-schema.sql`:
- `gallery_id` (Serial Primary Key)
- `hotel_id` (Foreign Key to hotel table)
- `image_url` (Text - Cloudinary URL)
- `caption` (Optional description)
- `display_order` (Integer for sorting)
- `created_at` (Timestamp)

## API Endpoints
Created `/api/hotel-gallery.ts` with:
- **GET** - Fetch gallery images for a hotel (query: hotel_id)
- **POST** - Add new gallery image (body: hotel_id, image_url, caption, display_order)
- **DELETE** - Remove gallery image (query: gallery_id)

## Admin Panel Features (`/admin/hotels`)
Added gallery management to each hotel card:
- **Gallery Button** (📸 Gallery) - Opens gallery modal
- **Gallery Modal** includes:
  - Add new image form with Cloudinary upload
  - Caption input (optional)
  - Display order control
  - Grid view of all gallery images
  - Delete button for each image
  - Image count display

## Customer-Facing Features (`/hotels`)
- Gallery images fetched when viewing hotel details
- Display up to 3 images by default in booking modal
- "View All" button if more than 3 images
- Click on any image to open in new tab
- Captions displayed as overlay on images
- Responsive grid layout

## How to Use

### For Admins:
1. Go to Admin Panel → Hotels
2. Click "📸 Gallery" button on any hotel card
3. Upload images using Cloudinary upload component
4. Add optional captions
5. Set display order (lower numbers appear first)
6. Click "Add Image to Gallery"
7. Delete images using the Delete button on each image

### For Customers:
- Gallery images automatically appear when viewing hotel details
- Click "View Details" or "Book Now" on any hotel
- Scroll down to see Hotel Gallery section
- Click on images to view full size
- Use "View All" to see all photos

## Files Modified:
1. `database/hotel-gallery-schema.sql` (new)
2. `pages/api/hotel-gallery.ts` (new)
3. `pages/admin/hotels.tsx` (added gallery management)
4. `pages/hotels/index.tsx` (added gallery display)

## Database Migration:
Run this SQL in your Neon database:
```sql
CREATE TABLE IF NOT EXISTS hotel_gallery (
    gallery_id SERIAL PRIMARY KEY,
    hotel_id VARCHAR(10) NOT NULL REFERENCES hotel(hotel_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hotel_gallery_hotel_id ON hotel_gallery(hotel_id);
CREATE INDEX IF NOT EXISTS idx_hotel_gallery_order ON hotel_gallery(hotel_id, display_order);
```

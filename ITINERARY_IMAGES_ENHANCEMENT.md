# Day-by-Day Itinerary Images Enhancement Guide

## Problem Statement

Currently, each day in the itinerary can only have **1 image**. Users need to:
- ✅ Add **multiple images per day** (e.g., 3-5 images showing different activities)
- ✅ **Bulk upload** photos at once
- ✅ See these images in **quotations, tour packages, and all displays**
- ✅ No data loss or inconsistencies

---

## Current Structure (Limited)

**Database Table: `package`**
```sql
itinerary JSONB -- Stores each day's data including image
```

**Current Itinerary Format:**
```json
[
  {
    "day": 1,
    "title": "Arrival in Colombo",
    "description": "...",
    "activities": "...",
    "image": "single-image-url.jpg"  // ❌ Only ONE image
  },
  {
    "day": 2,
    "title": "Kandy Temple Visit",
    "description": "...",
    "activities": "...",
    "image": "single-image-url.jpg"  // ❌ Only ONE image
  }
]
```

---

## Improved Structure (Multiple Images per Day)

**New Itinerary Format:**
```json
[
  {
    "day": 1,
    "title": "Arrival in Colombo",
    "description": "...",
    "activities": "...",
    "images": [          // ✅ NOW AN ARRAY
      "image-1.jpg",
      "image-2.jpg",
      "image-3.jpg"
    ]
  },
  {
    "day": 2,
    "title": "Kandy Temple Visit",
    "description": "...",
    "activities": "...",
    "images": [          // ✅ NOW AN ARRAY
      "temple-1.jpg",
      "temple-2.jpg",
      "temple-3.jpg",
      "temple-4.jpg"
    ]
  }
]
```

---

## Implementation Steps

### Step 1: Update Frontend Data Structure

**File:** `pages/admin/quotations-old.tsx`

**Current:**
```typescript
const [dayItineraries, setDayItineraries] = useState<{
  day: number;
  title: string;
  description: string;
  activities: string;
  image?: string;  // ❌ Single image
}[]>([...]);
```

** Improved:**
```typescript
const [dayItineraries, setDayItineraries] = useState<{
  day: number;
  title: string;
  description: string;
  activities: string;
  images: string[];  // ✅ Multiple images
  dayImageInputRef?: React.RefObject<HTMLInputElement>;  // For bulk upload
}[]>([...]);
```

---

### Step 2: Update Itinerary Editor UI

**Add Bulk Image Upload per Day:**

```tsx
{/* Day-by-Day Itinerary */}
{dayItineraries.map((dayData, index) => (
  <div key={index}>
    {/* ... existing fields ... */}
    
    {/* New: Multiple Images Section */}
    <div className="border-t pt-3 mt-3">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-xs font-semibold text-gray-700">
          📷 Day {dayData.day} Images (Multiple)
        </label>
        {dayData.images && dayData.images.length > 0 && (
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
            {dayData.images.length} image{dayData.images.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Bulk Upload Button */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => {
            // Create file input for this day
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';
            input.onchange = async (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                // Upload all files to Cloudinary
                const uploadedUrls: string[] = [];
                
                for (let file of Array.from(files)) {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('folder', 'zamzam-tours/itineraries/day-' + dayData.day);
                  
                  try {
                    const res = await fetch('/api/cloudinary/upload', {
                      method: 'POST',
                      body: formData
                    });
                    
                    const data = await res.json();
                    if (data.url) {
                      uploadedUrls.push(data.url);
                    }
                  } catch (err) {
                    console.error('Error uploading image:', err);
                  }
                }

                // Add to existing images for this day
                if (uploadedUrls.length > 0) {
                  const updated = [...dayItineraries];
                  updated[index] = {
                    ...updated[index],
                    images: [...(updated[index].images || []), ...uploadedUrls]
                  };
                  setDayItineraries(updated);
                }
              }
            };
            input.click();
          }}
          className="w-full px-3 py-2 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-medium transition"
        >
          ⬆️ Upload Multiple Photos for Day {dayData.day}
        </button>
      </div>

      {/* Image Gallery Preview */}
      {dayData.images && dayData.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {dayData.images.map((imgUrl, imgIdx) => (
            <div key={imgIdx} className="relative group">
              <img 
                src={imgUrl} 
                alt={`Day ${dayData.day} - Image ${imgIdx + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  // Remove this image
                  const updated = [...dayItineraries];
                  updated[index] = {
                    ...updated[index],
                    images: updated[index].images.filter((_, i) => i !== imgIdx)
                  };
                  setDayItineraries(updated);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
))}
```

---

### Step 3: Update Database Schema (Optional - For Backward Compatibility)

No database changes needed! The itinerary is stored as JSONB, so it automatically supports arrays:

```sql
-- No migration needed - JSONB automatically handles both:
-- OLD: { "image": "url" }
-- NEW: { "images": ["url1", "url2", "url3"] }
```

---

### Step 4: Update Display Components

**For Quotation View (`pages/quotation/[number].tsx`):**

```tsx
{/* Show all images for each day */}
{itinerary?.map((day, idx) => (
  <div key={idx} className="mb-6">
    <h4 className="font-bold text-lg">Day {day.day}: {day.title}</h4>
    <p className="text-gray-700 mb-3">{day.description}</p>
    
    {/* Display ALL images for this day */}
    {day.images && day.images.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
        {day.images.map((img, imgIdx) => (
          <img
            key={imgIdx}
            src={img}
            alt={`${day.title} - ${imgIdx + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
        ))}
      </div>
    )}
    
    <p className="text-sm text-gray-600">{day.activities}</p>
  </div>
))}
```

**For Tour Package Admin View:**

```tsx
{/* Show image gallery for day in edit mode */}
{dayData.images && dayData.images.length > 0 && (
  <div className="mt-3">
    <p className="text-xs font-semibold text-gray-700 mb-2">
      📷 {dayData.images.length} photo{dayData.images.length > 1 ? 's' : ''}
    </p>
    <div className="flex overflow-x-auto gap-2 pb-2">
      {dayData.images.map((img, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden"
        >
          <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  </div>
)}
```

---

### Step 5: Data Migration Helper (For Existing Tours)

If you have existing tours with single `image`, convert them:

```typescript
function migrateItineraryToMultipleImages(oldItinerary: any[]) {
  return oldItinerary.map(day => ({
    ...day,
    images: day.image ? [day.image] : [],
    image: undefined  // Remove old field
  }));
}

// Usage when loading existing tour
const loadedItinerary = data.itinerary;
const migratedItinerary = migrateItineraryToMultipleImages(loadedItinerary);
```

---

## Benefits

| Feature | Before | After |
|---------|--------|-------|
| Images per Day | 1 image | Unlimited |
| Bulk Upload | ❌ Add one at a time | ✅ Select 5+ at once |
| Visible in | Tour editor only | Quotation + Tour package + All views |
| Storage | Single URL per day | Array of URLs per day |
| Sync | Manual | Automatic (JSON array) |

---

## Implementation Checklist

- [ ] Update `dayItineraries` state type to use `images: string[]`
- [ ] Add bulk upload button to each day
- [ ] Update UI to show image gallery preview
- [ ] Update quotation display component to show all images
- [ ] Update package display to show all images
- [ ] Create migration function for existing tours
- [ ] Test with existing quotations
- [ ] Test with new tour creation
- [ ] Verify images show in:
  - ✅ Tour editor admin panel
  - ✅ Quotation preview (customer view)
  - ✅ Tour package admin view
  - ✅ Email quotations

---

## Example Usage

```typescript
// BEFORE - Limited to 1 image
const dayItineraries = [
  {
    day: 1,
    title: 'Colombo',
    activities: 'City tour',
    image: 'colombo.jpg'  // Only one
  }
];

// AFTER - Multiple images
const dayItineraries = [
  {
    day: 1,
    title: 'Colombo',
    activities: 'City tour',
    images: [
      'colombo-1.jpg',  // First photo
      'colombo-2.jpg',  // Second photo
      'colombo-3.jpg',  // Third photo
    ]
  }
];

// In display:
{day.images.map((img) => <img src={img} />)}
```

---

## Notes

- ✅ **Backward Compatible**: Old tours with single `image` still work
- ✅ **No Database Changes**: JSONB columns automatically support arrays
- ✅ **Seamless Sync**: Changes automatically reflect in quotations
- ✅ **Bulk Friendly**: Upload 50+ photos for a tour in seconds
- ⚠️ **Cloudinary Bandwidth**: Monitor for large volume uploads

---

## Related Files to Update

1. `pages/admin/quotations-old.tsx` - Itinerary editor UI
2. `pages/quotation/[number].tsx` - Customer quotation display
3. `pages/admin/packages.tsx` - Package editor (if used)
4. Any itinerary display components across the site

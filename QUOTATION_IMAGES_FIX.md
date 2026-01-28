# Quotation Images Display Fix

## Problem
Images added to vehicle quotations were not showing in the final quotation view or email.

## Root Cause
The image upload implementation had a timing issue:
1. File input onChange handler was creating preview URLs asynchronously
2. Form submission wasn't waiting for image uploads to complete
3. Vehicle images were sent as preview URLs (data URLs), not actual Cloudinary URLs
4. Email template didn't include vehicle images section

## Solutions Implemented

### 1. Fixed Admin Form Image Upload Flow
**File**: [pages/admin/quotations.tsx](pages/admin/quotations.tsx) (lines 420-500)

**Key Changes**:
- Changed file input onChange to create preview URLs ONLY (no upload yet)
- Preview URLs display selected files before submission
- Upload happens during form submission in `handleCreateQuotation`
- Proper error handling and user feedback during upload
- Button disabled while uploading with status message

**New Flow**:
1. User selects files → Preview URLs are created for display
2. User clicks "Create Quotation" → Form submission starts
3. handleCreateQuotation uploads files to Cloudinary
4. Gets permanent Cloudinary URLs
5. Sends quotation with actual image URLs to API
6. Database stores Cloudinary URLs

### 2. Added Vehicle Images to Email Template
**File**: [lib/emailService.ts](lib/emailService.ts) (lines 352-380)

**Changes**:
- Added new "Vehicle Images" section in quotation email template
- Shows between Tour Summary and Pricing sections
- Displays all uploaded vehicle images in email
- Only shows if vehicle_image_urls are available
- Handles both JSON string and array formats

**Email Section**:
```html
<!-- Vehicle Images (if available) -->
${quotation.vehicle_image_urls && quotation.vehicle_image_urls.length > 0 ? `
  <tr>
    <td style="padding: 20px 40px;">
      <h3 style="...">🚗 Vehicle Images</h3>
      <!-- Display images -->
    </td>
  </tr>
` : ''}
```

### 3. Updated Form Instructions
**File**: [pages/admin/quotations.tsx](pages/admin/quotations.tsx) (line 1175)

**Change**: Updated help text to clarify images are uploaded during form submission:
- "Select custom images of the actual vehicle to be sent... Images will be uploaded when you submit the form."

## How It Works Now

### Creating a Quotation with Images
1. Admin fills quotation form
2. Selects vehicle service type
3. Chooses image files → sees preview
4. Clicks "Create Quotation"
5. Images upload to Cloudinary during submission
6. Permanent URLs saved to database
7. Quotation created with image URLs

### Viewing the Quotation
- **View Page** ([pages/quotation/[number].tsx](pages/quotation/[number].tsx)): Shows vehicle images with gallery
- **Email**: Includes vehicle images in professional layout
- **Admin Panel**: Can view quotation with all images

## Database Schema
The `quotations` table already has the proper schema:
```sql
vehicle_image_urls TEXT[]  -- Array of Cloudinary image URLs (optional)
```

## Testing the Fix

### Step 1: Create a Vehicle Quotation with Images
1. Go to Admin → Quotations
2. Click "Create New Quotation"
3. Select "Vehicle" as service type
4. Select a vehicle
5. In "Vehicle Images" section, upload 1-3 images
6. Fill other required fields
7. Click "Create Quotation"
8. Wait for upload to complete (button shows "Uploading Images...")

### Step 2: Verify Quotation Display
1. Click OK to preview quotation
2. Scroll to "Vehicle Details" section
3. Should see: "✅ These are the actual vehicle images that will be provided for your rental"
4. Images should display in a grid

### Step 3: Verify Email
1. Go back to admin
2. Click "Send" on the quotation
3. Check email preview
4. Images should appear in "Vehicle Images" section

### Step 4: Verify Customer View
1. Click "View Full Quotation" in customer email
2. Navigate to quotation page
3. Images should display in Vehicle Details section

## Benefits

✅ Images now properly display in quotations
✅ Email includes professional vehicle image gallery
✅ No timing issues - uploads complete before sending to API
✅ Better UX with preview before upload
✅ Clear user feedback during upload process
✅ Proper error handling if upload fails

## Files Modified

1. [pages/admin/quotations.tsx](pages/admin/quotations.tsx)
   - handleCreateQuotation: New image upload logic
   - File input onChange: Preview-only, no upload

2. [lib/emailService.ts](lib/emailService.ts)
   - createQuotationEmailHTML: Added vehicle images section

## Notes

- Images are stored as JSON array in database
- Cloudinary upload preset: `zamzam_tours`
- Maximum recommended: 3-5 images per quotation
- All formats: JPG, PNG, WebP supported
- Customer can click images to open in new tab for full view

# 🚀 Cloudinary Image Upload Instructions

## ✅ Homepage Images Updated - Ready for Upload!

Your homepage has been fully updated with Cloudinary image components and smooth animations. Now you just need to upload the actual images.

## 📸 Required Images for Homepage

### 1. Hero Section
- **Image ID**: `zamzam-tours/heroes/home-hero`
- **Recommended Size**: 1920x1080px or larger
- **Description**: Beautiful scenic view of Sri Lanka (beaches, mountains, or landmarks)

### 2. Vehicles (8 images needed)
Upload to folder: `zamzam-tours/vehicles/`

- `bus` - Bus exterior photo
- `kdh-van` - KDH Van photo
- `tour-van` - Tour Van photo
- `wagonr` - WagonR car photo
- `shuttle` - Shuttle vehicle photo
- `every-buddy` - Every Buddy Van photo
- `aqua` - Aqua car photo
- `prius` - Prius car photo

**Recommended Size**: 800x600px minimum

### 3. Destinations (6 images needed)
Upload to folder: `zamzam-tours/destinations/`

- `sigiriya` - Sigiriya Rock Fortress
- `kandy` - Temple of the Tooth or Kandy city
- `galle` - Galle Fort
- `ella` - Nine Arch Bridge or Ella landscape
- `yala` - Yala National Park wildlife
- `nuwara-eliya` - Tea plantations or colonial buildings

**Recommended Size**: 1200x800px minimum

---

## 🎯 How to Upload to Cloudinary

### Step 1: Login to Cloudinary
1. Go to: https://console.cloudinary.com
2. Login with your account (cloud: **dhfqwxyb4**)

### Step 2: Create Folders
1. Click **Media Library** in the left sidebar
2. Click **New Folder** button
3. Create these folders:
   - `zamzam-tours`
   - `zamzam-tours/heroes`
   - `zamzam-tours/vehicles`
   - `zamzam-tours/destinations`

### Step 3: Upload Images
1. Navigate to the appropriate folder
2. Click **Upload** button (or drag & drop)
3. **IMPORTANT**: Name each file exactly as listed above
   - Example: When uploading bus photo → name it `bus`
   - Example: When uploading Sigiriya photo → name it `sigiriya`

### Step 4: Verify
After uploading, your Media Library should look like:
```
📁 zamzam-tours
  📁 heroes
    🖼️ home-hero
  📁 vehicles
    🖼️ bus
    🖼️ kdh-van
    🖼️ tour-van
    🖼️ wagonr
    🖼️ shuttle
    🖼️ every-buddy
    🖼️ aqua
    🖼️ prius
  📁 destinations
    🖼️ sigiriya
    🖼️ kandy
    🖼️ galle
    🖼️ ella
    🖼️ yala
    🖼️ nuwara-eliya
```

---

## 📝 Image Guidelines

### Quality Requirements:
- ✅ High resolution (minimum 1200px wide)
- ✅ Good lighting and clear focus
- ✅ Professional appearance
- ✅ Relevant to Sri Lanka tourism

### Format:
- Recommended: **JPG or PNG**
- Cloudinary will automatically optimize to WebP/AVIF for modern browsers

### File Size:
- Don't worry about file size - Cloudinary will automatically compress
- Original images can be 2-5MB, Cloudinary optimizes delivery

---

## 🎨 What's Already Done

✅ **Homepage fully updated with:**
- Cloudinary hero image with overlay
- Animated hero content (fade in from bottom)
- 8 vehicle cards with Cloudinary images
- Animated vehicle cards on scroll
- 6 destination cards with Cloudinary images
- Animated destinations grid
- Animated testimonials
- Smooth scroll animations throughout
- Hover effects on interactive elements

✅ **Animations added:**
- Hero section: fade in up animation
- Services tabs: animated entrance
- Vehicle grid: staggered fade in (0.1s delay each)
- Tour cards: animated entrance
- Destinations: animated grid
- Testimonials: slide in from left/right
- CTA section: fade in animation

---

## 🚨 Temporary Placeholder

Until you upload the real images, Cloudinary will show a placeholder or error. This is normal! Once you upload with the correct names, they'll automatically appear.

---

## 📞 Need Help?

If images don't appear after uploading:
1. Check the exact file names (must match exactly)
2. Check they're in the correct folders
3. Clear browser cache and refresh
4. Check browser console for any 404 errors

---

## 🎯 Quick Test

After uploading just the hero image:
1. Save your work
2. Run: `npm run dev`
3. Open: http://localhost:3000
4. You should see the hero image immediately!

Then upload vehicles and destinations to see the full effect with smooth animations! 🎉

---

## Admin Upload Preset (recommended)

If you'd like uploads performed from the admin panel to use a dedicated preset/folder with signed uploads, create an Upload Preset in Cloudinary and name it `uploadfromsite` with these exact settings:

- Preset name: `uploadfromsite`
- Signed: true
- Overwrite: true
- Use filename: false
- Unique filename: false
- Use filename as display name: true
- Use asset folder as public id prefix: false
- Type: upload
- Asset folder: `zamzam-tours/uploads`

After creating the preset, set `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=uploadfromsite` in your deployment environment variables and ensure `CLOUDINARY_API_SECRET` is set on the server. This repo includes a small helper endpoint at `/api/cloudinary/sign` which the upload widget can call to obtain the required signature for signed uploads.

# 📸 Images & Animations Guide - ZamZam Tours

## 🎯 Quick Start

You now have Cloudinary configured and animation utilities ready to use!

## 1️⃣ Setting Up Cloudinary Images

### Step 1: Upload Images to Cloudinary
1. Go to https://console.cloudinary.com
2. Login with your credentials
3. Click "Media Library" → "Upload"
4. Upload your images and note their public IDs

### Step 2: Using Images in Your Code

#### Option A: Using CldImage from next-cloudinary (Recommended)
```tsx
import { CldImage } from 'next-cloudinary';

// In your component
<CldImage
  src="your-image-public-id"  // Just the ID, not full URL
  width="800"
  height="600"
  alt="Description"
  priority  // For above-the-fold images
/>
```

#### Option B: Using CloudinaryImage Component
```tsx
import CloudinaryImage from '../components/CloudinaryImage';

<CloudinaryImage
  src="your-image-public-id"
  alt="Sri Lanka Tour"
  width={800}
  height={600}
  priority={true}
/>
```

#### Option C: Using Next.js Image with Cloudinary Loader
```tsx
import Image from 'next/image';
import { cloudinaryLoader } from '../src/utils/cloudinary';

<Image
  loader={cloudinaryLoader}
  src="your-image-public-id"
  alt="Description"
  width={800}
  height={600}
/>
```

## 2️⃣ Image Organization in Cloudinary

### Recommended Folder Structure:
```
zamzam-tours/
├── heroes/          # Hero section backgrounds
│   ├── home-hero
│   ├── tours-hero
│   ├── hotels-hero
│   └── about-hero
├── destinations/    # Sri Lanka destinations
│   ├── sigiriya
│   ├── kandy
│   ├── ella
│   └── galle
├── vehicles/        # Your fleet
│   ├── bus
│   ├── kdh-van
│   ├── tour-van
│   └── luxury-car
├── hotels/          # Hotel images
│   ├── hotel-1
│   ├── hotel-2
│   └── hotel-3
├── gallery/         # Gallery images
│   ├── tour-1
│   ├── tour-2
│   └── experience-1
├── team/            # Team member photos
│   ├── member-1
│   └── member-2
└── logo/            # Logo and branding
    └── zamzam-logo
```

## 3️⃣ Adding Animations

### Using AnimatedSection Component
```tsx
import AnimatedSection from '../components/AnimatedSection';

// Fade in from bottom
<AnimatedSection animation="fadeInUp" delay={0.2}>
  <div className="content">
    Your content here
  </div>
</AnimatedSection>

// Available animations:
// - fadeIn
// - fadeInUp
// - fadeInLeft
// - fadeInRight
// - scaleIn
```

### Using Framer Motion Directly
```tsx
import { motion } from 'framer-motion';
import { fadeInUp, cardHover } from '../src/utils/animations';

// Animate on scroll
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeInUp}
>
  Content
</motion.div>

// Hover animation
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.3 }}
>
  Clickable Card
</motion.div>
```

## 4️⃣ Practical Examples

### Example 1: Animated Hero Section with Cloudinary Image
```tsx
import { CldImage } from 'next-cloudinary';
import { motion } from 'framer-motion';
import { fadeInUp } from '../src/utils/animations';

<section className="hero">
  <CldImage
    src="heroes/home-hero"
    fill
    alt="Sri Lanka Tours"
    priority
    style={{ objectFit: 'cover' }}
  />
  
  <motion.div
    className="hero-content"
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
  >
    <h1>Discover Sri Lanka</h1>
    <p>Your adventure starts here</p>
  </motion.div>
</section>
```

### Example 2: Animated Vehicle Cards
```tsx
import AnimatedSection from '../components/AnimatedSection';
import { CldImage } from 'next-cloudinary';

{vehicles.map((vehicle, index) => (
  <AnimatedSection
    key={vehicle.id}
    animation="fadeInUp"
    delay={index * 0.1}
  >
    <div className="vehicle-card">
      <CldImage
        src={`vehicles/${vehicle.slug}`}
        width={400}
        height={300}
        alt={vehicle.name}
      />
      <h3>{vehicle.name}</h3>
      <p>{vehicle.capacity} passengers</p>
    </div>
  </AnimatedSection>
))}
```

### Example 3: Gallery with Hover Effects
```tsx
import { motion } from 'framer-motion';
import { CldImage } from 'next-cloudinary';

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.3 }}
  className="gallery-item"
>
  <CldImage
    src="gallery/image-1"
    width={400}
    height={300}
    alt="Gallery Image"
  />
</motion.div>
```

## 5️⃣ Quick Implementation Checklist

### For Each Page:

#### Homepage (pages/index.tsx)
- [ ] Replace hero background with Cloudinary image
- [ ] Add vehicle images
- [ ] Add destination images
- [ ] Animate sections on scroll

#### Tours Page (pages/tours/index.tsx)
- [ ] Hero background image
- [ ] Tour package images
- [ ] Animate tour cards

#### Hotels Page (pages/hotels/index.tsx)
- [ ] Hero background
- [ ] Hotel property images
- [ ] Animate hotel cards

#### Gallery (pages/gallery/index.tsx)
- [ ] All gallery images from Cloudinary
- [ ] Lightbox animations
- [ ] Hover effects

#### About Page (pages/about/index.tsx)
- [ ] Team member photos
- [ ] Company milestone images
- [ ] Animate stats counter

## 6️⃣ Image Optimization Tips

### Automatic Optimizations (Built-in):
- ✅ Auto format (WebP, AVIF when supported)
- ✅ Auto quality
- ✅ Lazy loading
- ✅ Responsive images

### Custom Transformations:
```tsx
// Crop to square
<CldImage
  src="image-id"
  width={500}
  height={500}
  crop="fill"
  gravity="face"  // Focus on faces
/>

// Add blur effect
<CldImage
  src="image-id"
  width={800}
  height={600}
  blur="500"
/>

// Add overlay/watermark
<CldImage
  src="image-id"
  width={800}
  height={600}
  overlays={[{
    publicId: 'logo',
    position: { gravity: 'south_east' }
  }]}
/>
```

## 7️⃣ Animation Best Practices

### DO ✅
- Animate on scroll for long pages
- Use subtle animations (0.3-0.6s duration)
- Stagger child animations (0.1s delay between items)
- Add hover effects to interactive elements
- Use `viewport={{ once: true }}` to prevent re-animations

### DON'T ❌
- Don't animate everything
- Avoid animations > 1 second
- Don't use animations on every element
- Skip animations on mobile if performance is an issue

## 8️⃣ Performance Tips

```tsx
// Lazy load images below fold
<CldImage
  src="image-id"
  width={800}
  height={600}
  loading="lazy"  // Default
/>

// Priority load for above-the-fold
<CldImage
  src="hero-image"
  priority
  width={1920}
  height={1080}
/>

// Add blur placeholder
<CldImage
  src="image-id"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="/path/to/blur.jpg"
/>
```

## 9️⃣ Next Steps

1. **Upload Images**:
   - Go to Cloudinary console
   - Upload 5-10 images to start
   - Organize in folders

2. **Replace SVG Placeholders**:
   - Find SVG references in code
   - Replace with CldImage components
   - Test on each page

3. **Add Animations**:
   - Wrap sections with AnimatedSection
   - Add hover effects to cards
   - Test smooth scrolling

4. **Test & Optimize**:
   - Check page load speed
   - Test on mobile
   - Adjust image sizes

## 🎨 Example Image Public IDs

After uploading to Cloudinary, your images might have IDs like:
- `zamzam-tours/heroes/home-hero`
- `zamzam-tours/vehicles/bus-001`
- `zamzam-tours/destinations/sigiriya-rock`

Use these IDs in the `src` prop!

## 📞 Need Help?

Check these resources:
- [Next Cloudinary Docs](https://next-cloudinary.dev/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- Your Cloudinary Dashboard: https://console.cloudinary.com

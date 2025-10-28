# 🎬 How to Add More Hero Videos

## ✅ Current Setup

Your homepage hero section now plays videos in a **continuous loop** from the `zamzam-tours/heroes/home` folder!

## 📂 Upload Videos to Cloudinary

### Step 1: Upload to Cloudinary
1. Go to https://console.cloudinary.com
2. Navigate to **Media Library**
3. Go to folder: `zamzam-tours/heroes/home`
4. Upload your videos (MP4 format recommended)

### Step 2: Get Video URLs

After uploading, your videos will have URLs like:
```
https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/VIDEO_NAME.mp4
```

## 🔧 Add Videos to Homepage

### Option 1: Using Public IDs (Recommended)

Open `pages/index.tsx` and find the `heroVideos` array (around line 18):

```tsx
const heroVideos = [
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/191283-889685028_small_eyum5p.mp4',
  // Add more videos below:
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/video-2.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/video-3.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/video-4.mp4',
];
```

### Example with Real Video Names:

```tsx
const heroVideos = [
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/191283-889685028_small_eyum5p.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/sri-lanka-beach.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/sigiriya-drone.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/kandy-temple.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/ella-train.mp4',
];
```

## 🎯 How It Works

1. **First video plays** when page loads
2. **When video ends**, automatically switches to next video
3. **After last video**, loops back to first video
4. **Infinite loop** - videos keep playing continuously

## 🎨 Video Sequence Example

```
Video 1 (15s) → Video 2 (20s) → Video 3 (12s) → Video 4 (18s) → Back to Video 1 → ...
```

## 📝 Video Recommendations

### Format:
- **MP4** (H.264 codec) - Best compatibility
- **WebM** - Alternative for modern browsers

### Size:
- **Width**: 1920px minimum (Full HD)
- **Duration**: 10-30 seconds per video
- **File size**: Under 10MB per video (Cloudinary optimizes)

### Content Ideas:
- 🏖️ Beautiful beaches (Mirissa, Arugam Bay)
- 🏰 Cultural sites (Sigiriya, Kandy Temple)
- 🚂 Scenic train rides (Ella to Kandy)
- 🐘 Wildlife (Yala Safari, elephants)
- 🍵 Tea plantations (Nuwara Eliya)
- 🌅 Sunset/sunrise scenes
- 🚗 Road trips/scenic drives

## 🎬 Current Video

Currently using: `191283-889685028_small_eyum5p.mp4`

**To add more videos:**
1. Upload to same folder in Cloudinary
2. Copy the video URL
3. Add to the `heroVideos` array
4. Save and refresh browser!

## ⚡ Quick Update

After uploading videos:

```tsx
// In pages/index.tsx (around line 18)
const heroVideos = [
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/VIDEO_1.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/VIDEO_2.mp4',
  'https://res.cloudinary.com/dhfqwxyb4/video/upload/zamzam-tours/heroes/home/VIDEO_3.mp4',
];
```

**No server restart needed** - just refresh the browser! 🚀

## 🔥 Pro Tips

1. **Keep videos short** (10-20 seconds) for better user experience
2. **Use different scenes** - variety keeps viewers engaged
3. **Test on mobile** - videos should work on all devices
4. **Optimize before upload** - Use compressed MP4 files
5. **Add 5+ videos** for a dynamic hero section

---

**Your hero section is now a video carousel!** 🎉

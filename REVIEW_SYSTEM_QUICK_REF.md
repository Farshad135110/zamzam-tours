# Review System - Quick Reference

## ⚠️ ACTION REQUIRED: Get Google Place ID

**Current Status:** Google review links use placeholder `YOUR_GOOGLE_PLACE_ID`

**How to Fix:**
1. Go to https://business.google.com/
2. Select your business → "Get more reviews"
3. Copy the Place ID from the URL
4. Replace in these 4 files:
   - `lib/emailService.ts` (line ~395)
   - `lib/postTourEmailTemplate.ts` (line 7)
   - `pages/reviews/index.tsx` (line 9)
   - `components/Footer.tsx` (line ~76)

**Search Command:**
```powershell
Select-String -Path . -Pattern "YOUR_GOOGLE_PLACE_ID" -Recurse
```

---

## 📧 Email Templates

### Quotation Email (Automatic)
- **File:** `lib/emailService.ts`
- **Triggers:** When quotation is sent
- **Review Section:** After pricing, before footer
- **Buttons:** TripAdvisor + Google

### Post-Tour Email (Manual/Automated)
- **File:** `lib/postTourEmailTemplate.ts`
- **Send:** 2-3 days after tour completion
- **Includes:** Thank you + review request + 10% discount offer

**Usage:**
```typescript
import { createPostTourReviewEmail } from '../lib/postTourEmailTemplate';

const html = createPostTourReviewEmail({
  customerName: 'John Doe',
  tourName: '7-Day Tour',
  completionDate: '2024-01-15'
});

await resend.emails.send({
  to: customer.email,
  subject: 'Thank You for Traveling with Us! 🌟',
  html
});
```

---

## 🌐 Website Pages

### Reviews Page
- **URL:** `/reviews`
- **File:** `pages/reviews/index.tsx`
- **Features:**
  - Display customer testimonials
  - Filter by platform (All/TripAdvisor/Google)
  - Prominent review request buttons
  - Trust indicators
  - CTA to book tours

**To Update Testimonials:**
Edit the `testimonials` array in `pages/reviews/index.tsx` (lines 13-80)

### Footer (All Pages)
- **File:** `components/Footer.tsx`
- **Section:** "Enjoyed Your Experience?"
- **Buttons:** TripAdvisor, Google, View All Reviews
- **Always Visible:** Yes, on every page

---

## 🔗 Review Platform Links

### TripAdvisor ✅
**Write Review:**
```
https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html
```

**View Reviews:**
```
https://www.tripadvisor.com/Attraction_Review-g12364193-d34116256-Reviews-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html
```

### Google ⚠️ (Needs Place ID)
**Template:**
```
https://g.page/r/PLACE_ID/review
```

---

## 🚀 Daily Operations

### When Customer Books Tour
1. ✅ Quotation email sent automatically (includes review request)
2. Note tour end date in calendar

### 2-3 Days After Tour Completes
1. Send post-tour email using template
2. Personal touch: mention guide's name
3. Track if customer leaves review

### When Review is Received
1. **Respond within 24-48 hours**
2. Thank customer publicly
3. Share on social media (with permission)
4. Add to testimonials on website (if 5-star)

---

## 📊 Performance Tracking

### Key Metrics
- Reviews per month
- Average rating
- Response time to reviews
- Conversion rate (tours → reviews)

### Weekly Tasks
- [ ] Check TripAdvisor for new reviews
- [ ] Check Google for new reviews
- [ ] Respond to all reviews
- [ ] Update reviews page if needed

---

## 🛠️ File Locations Summary

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Quotation Email | `lib/emailService.ts` | Auto-sent with quote |
| Post-Tour Email | `lib/postTourEmailTemplate.ts` | Send after tour |
| Reviews Page | `pages/reviews/index.tsx` | Display testimonials |
| Footer Section | `components/Footer.tsx` | Site-wide CTA |
| Full Guide | `REVIEW_SYSTEM_GUIDE.md` | Complete documentation |

---

## ⚡ Quick Commands

**Test Email Template:**
```typescript
// In browser console or test file
const html = createPostTourReviewEmail({
  customerName: 'Test User',
  tourName: 'Test Tour',
  completionDate: new Date().toISOString()
});
console.log(html);
```

**Find All Review Links:**
```powershell
# PowerShell
Select-String -Path . -Pattern "tripadvisor.com|g.page" -Recurse

# Or search for
Select-String -Path . -Pattern "review" -Recurse -Include *.tsx,*.ts
```

---

## 🎯 Priority Actions

1. **Today:** Get Google Place ID and update files
2. **This Week:** Test post-tour email with completed tour
3. **Ongoing:** Respond to reviews within 24 hours
4. **Monthly:** Update testimonials on reviews page

---

## 📞 Support Resources

- **Resend Dashboard:** https://resend.com/dashboard
- **TripAdvisor Business:** https://www.tripadvisor.com/Owners
- **Google Business:** https://business.google.com/
- **Full Documentation:** `REVIEW_SYSTEM_GUIDE.md`

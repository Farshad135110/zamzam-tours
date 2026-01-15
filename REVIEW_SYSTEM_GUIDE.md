# Review System Implementation Guide

## Overview
A comprehensive review collection and display system integrated across the ZamZam Lanka Tours website and email communications to build social proof and improve conversion rates.

## Implementation Components

### 1. **Quotation Email Template** ✅
**Location:** `lib/emailService.ts`

**Features:**
- Review request section added after pricing details
- Green background with emerald theme (#f0fdf4)
- Two prominent CTA buttons:
  - TripAdvisor review (production URL ready)
  - Google review (needs Place ID - see below)
- Automatically included in all quotation emails

**When Triggered:**
- Sent when customer receives a quotation
- Encourages early engagement and booking confidence
- **BCC to Trustpilot:** `zamzamlankatours.com+9719517be2@invite.trustpilot.com` (automatically sends review invitation)

---

### 2. **Post-Tour Email Template** ✅
**Location:** `lib/postTourEmailTemplate.ts`

**Features:**
- Thank you message with tour details
- Prominent review request section
- Three review options:
  1. TripAdvisor review (primary)
  2. Google review (primary)
  3. Private feedback form (fallback)
- Social media follow buttons
- 10% discount offer for repeat bookings
- Beautiful gradient design matching brand colors

**How to Use:**
```typescript
import { createPostTourReviewEmail } from '../lib/postTourEmailTemplate';

const emailHtml = createPostTourReviewEmail({
  customerName: 'John Smith',
  tourName: '7-Day Cultural Heritage Tour',
  completionDate: '2024-01-15'
});

// Send via Resend or your email service
await resend.emails.send({
  from: 'ZamZam Lanka Tours <noreply@zamzamlankatours.com>',
  to: customerEmail,
  subject: 'Thank You for Traveling with Us! 🌟',
  html: emailHtml
});
```

**When to Send:**
- 2-3 days after tour completion
- Best time: When memories are fresh but customer is home
- Can be automated based on tour end date in database

---

### 3. **Reviews Page** ✅
**Location:** `pages/reviews/index.tsx`

**Features:**
- Hero section with average rating (5.0★)
- Review count and platform badges
- Prominent "Leave a Review" CTA buttons
- Filter tabs (All, TripAdvisor, Google)
- Customer testimonials grid with:
  - Star ratings
  - Verified badges
  - Tour names
  - Country flags
  - Platform indicators
- Trust indicators section
- "Why Travelers Trust Us" benefits
- CTA to explore tours

**Sample Data:**
Currently using 6 sample testimonials. Replace with real data by:
1. Fetching from TripAdvisor/Google APIs
2. Storing reviews in database
3. Manual import from platforms

**To Display Real Reviews:**
```typescript
// Create API endpoint: pages/api/reviews.ts
export default async function handler(req, res) {
  const reviews = await prisma.review.findMany({
    orderBy: { date: 'desc' },
    take: 20
  });
  res.json(reviews);
}

// Update reviews page to fetch data
const { data: reviews } = useSWR('/api/reviews', fetcher);
```

---

### 4. **Footer Integration** ✅
**Location:** `components/Footer.tsx`

**Features:**
- "Enjoyed Your Experience?" section
- Always visible across all pages
- Three action buttons:
  - Review on TripAdvisor
  - Review on Google
  - View All Reviews (links to /reviews)
- Responsive design (stacks on mobile)
- Subtle but prominent placement

**Styling:**
- Bordered section above copyright
- Centered content
- Brand-colored buttons with hover effects
- Mobile-optimized button sizing

---

## Review Platform URLs

### TripAdvisor (Ready) ✅
```
Write Review:
https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html

View Reviews:
https://www.tripadvisor.com/Attraction_Review-g12364193-d34116256-Reviews-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html
```

### Google Business (Needs Place ID) ⚠️
**Current Status:** Placeholder URL

**How to Get Your Google Place ID:**
1. Go to [Google Business Profile Manager](https://business.google.com/)
2. Sign in to your account
3. Select your business listing
4. Click "Get more reviews"
5. Copy your review link - it will look like:
   ```
   https://g.page/r/PLACE_ID/review
   ```
6. Extract the `PLACE_ID` from the URL

**Where to Update:**
Once you have the Place ID, replace `YOUR_GOOGLE_PLACE_ID` in:
- `lib/emailService.ts` (line ~395)
- `lib/postTourEmailTemplate.ts` (line 7)
- `pages/reviews/index.tsx` (line 9)
- `components/Footer.tsx` (line ~76)

**Quick Find & Replace:**
```bash
# Search for placeholder
grep -r "YOUR_GOOGLE_PLACE_ID" .

# Or use PowerShell
Select-String -Path . -Pattern "YOUR_GOOGLE_PLACE_ID" -Recurse
```

---

## Automation Recommendations

### Automated Post-Tour Emails
Create a scheduled task or cron job:

```javascript
// scripts/send-post-tour-emails.js
import { PrismaClient } from '@prisma/client';
import { createPostTourReviewEmail } from '../lib/postTourEmailTemplate';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPostTourEmails() {
  // Find tours completed 3 days ago
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const completedTours = await prisma.tourBooking.findMany({
    where: {
      endDate: {
        equals: threeDaysAgo
      },
      reviewEmailSent: false // Add this column to track
    },
    include: {
      customer: true,
      package: true
    }
  });

  for (const tour of completedTours) {
    const emailHtml = createPostTourReviewEmail({
      customerName: tour.customer.name,
      tourName: tour.package.title,
      completionDate: tour.endDate.toISOString()
    });

    await resend.emails.send({
      from: 'ZamZam Lanka Tours <noreply@zamzamlankatours.com>',
      to: tour.customer.email,
      subject: 'Thank You for Traveling with Us! 🌟',
      html: emailHtml
    });

    // Mark as sent
    await prisma.tourBooking.update({
      where: { id: tour.id },
      data: { reviewEmailSent: true }
    });
  }
}

sendPostTourEmails();
```

**Setup Cron Job:**
```bash
# Run daily at 10 AM
0 10 * * * node /path/to/scripts/send-post-tour-emails.js
```

---

## Review Collection Best Practices

### 1. **Timing is Everything**
- **Quotation Stage:** Plant the seed early
- **Post-Tour:** 2-3 days after completion (sweet spot)
- **Follow-up:** Send reminder after 1 week if no review

### 2. **Make It Easy**
- Direct links to review pages (no navigation needed)
- Multiple platform options (customer preference)
- Mobile-friendly buttons (44px min height)

### 3. **Incentivize Thoughtfully**
- ✅ Thank you message
- ✅ Recognition of their time
- ✅ Discount for next booking (10% mentioned in email)
- ❌ Don't offer incentives ONLY for positive reviews (against TripAdvisor/Google policies)

### 4. **Respond to Reviews**
- Monitor TripAdvisor and Google daily
- Respond to ALL reviews within 24-48 hours
- Thank positive reviewers
- Address negative feedback professionally
- Show you care about customer experience

### 5. **Leverage Reviews in Marketing**
- Display on homepage
- Include in social media posts
- Use in advertising campaigns
- Highlight in email signatures

---

## Analytics & Tracking

### Track Review Conversion
Add UTM parameters to review links:

```typescript
const tripadvisorUrl = `https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html?utm_source=email&utm_medium=post_tour&utm_campaign=reviews`;
```

### Monitor Performance
- Click-through rate on review buttons
- Percentage of customers leaving reviews
- Average rating trends
- Review volume over time

### Google Analytics Goals
Set up goals in GA4:
1. Click on "Review on TripAdvisor" button
2. Click on "Review on Google" button
3. Visit to /reviews page
4. External link clicks (outbound to review platforms)

---

## Database Schema for Reviews (Optional)

If you want to store reviews locally:

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_country VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  tour_name VARCHAR(255),
  platform VARCHAR(50), -- 'tripadvisor' or 'google'
  external_url VARCHAR(500),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT false -- For moderation
);
```

---

## Maintenance Checklist

### Weekly
- [ ] Check for new reviews on TripAdvisor
- [ ] Check for new reviews on Google
- [ ] Respond to unanswered reviews
- [ ] Update reviews page with new testimonials

### Monthly
- [ ] Analyze review metrics
- [ ] Test email templates (send to yourself)
- [ ] Verify all review links are working
- [ ] Update sample testimonials if needed

### Quarterly
- [ ] Review and update testimonials on reviews page
- [ ] A/B test different email subject lines
- [ ] Optimize review request timing
- [ ] Evaluate platform performance (TripAdvisor vs Google)

---

## Troubleshooting

### Reviews Not Submitting
- Verify TripAdvisor URL is correct
- Check if Google Place ID is updated
- Test links in incognito mode
- Ensure customer has valid TripAdvisor/Google account

### Low Review Rate
- Shorten time to ask (try 1-2 days post-tour)
- Simplify call-to-action
- Add personal touch (mention guide's name)
- Follow up with customers who haven't reviewed

### Email Deliverability Issues
- Check Resend dashboard for bounces
- Verify sender domain is authenticated
- Test emails with Mail Tester
- Avoid spam trigger words

---

## Next Steps

1. **Get Google Place ID** (Priority 1)
   - Login to Google Business Profile
   - Copy review link
   - Update all 4 files with actual Place ID

2. **Test End-to-End**
   - Send test quotation email
   - Send test post-tour email
   - Click all review buttons
   - Verify mobile responsiveness

3. **Set Up Automation**
   - Create database column `reviewEmailSent`
   - Write cron job for post-tour emails
   - Test automation with sample data

4. **Populate Reviews Page**
   - Export existing reviews from TripAdvisor/Google
   - Add to testimonials array or database
   - Update count and average rating

5. **Monitor & Optimize**
   - Set up Google Analytics events
   - Track review conversion rate
   - A/B test email timing
   - Gather feedback from team

---

## Support

If you need help:
- Review implementation: Check this guide
- Email issues: Check Resend dashboard
- Platform issues: Contact TripAdvisor/Google support
- Technical bugs: Check browser console and server logs

Last Updated: January 2024

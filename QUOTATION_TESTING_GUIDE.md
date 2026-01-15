# Quotation System - Testing Guide

## Quick Test Workflow

### Step 1: Start Development Server

```bash
npm run dev
```

Server will start at: http://localhost:3000

### Step 2: Test Quick Quote Form (Homepage)

1. **Open homepage:** http://localhost:3000
2. **Scroll down** to "Get Your Free Tour Quotation" section (green background)
3. **Click "📝 Get Free Quote"** button
4. **Fill in the form:**
   - Your Name: Test Customer
   - Email: your-email@example.com (use your real email to receive test emails)
   - Phone: +1 234 567 8900 (optional)
   - Country: United States
   - Tour Package: Cultural Triangle - 5 Days
   - Start Date: (select future date)
   - End Date: (select date after start)
   - Number of Adults: 2
   - Number of Children: 1
   - Special Requests: Vegetarian meals required

5. **Click "✓ Request Quotation"**
6. **Verify success message** shows quotation number (e.g., ZZT-2026-0002)

**Expected Result:** Quotation created in database with status 'draft'

### Step 3: Test Admin Panel

1. **Login to admin panel:**
   - Go to: http://localhost:3000/login
   - Username: (your admin username)
   - Password: (your admin password)

2. **Navigate to Quotations:**
   - Click "💰 Quotations" in sidebar
   - Or go to: http://localhost:3000/admin/quotations

3. **Verify dashboard:**
   - See statistics: Total, Sent, Accepted, Conversion Rate
   - See your new quotation in the table
   - Status should be "draft"

### Step 4: Test Send Email

1. **In the quotations table, find your test quotation**

2. **Click "Send" button**

3. **Check console logs** (Terminal where `npm run dev` is running):
   ```
   === EMAIL (Development Mode) ===
   From: noreply@zamzamlankatours.com
   To: your-email@example.com
   Subject: Tour Quotation ZZT-2026-0002 - Cultural Triangle - 5 Days
   HTML Length: 8234 characters
   ================================
   ```

4. **Verify database update:**
   - Quotation status changes to "sent"
   - sent_at timestamp is set

**Note:** In development mode (EMAIL_PROVIDER=console), emails are logged instead of sent.

### Step 5: Test Customer View Page

1. **Copy quotation number** from admin panel (e.g., ZZT-2026-0002)

2. **Open customer view:**
   - Go to: http://localhost:3000/quotation/ZZT-2026-0002

3. **Verify page displays:**
   - ✅ Quotation header with number
   - ✅ Customer details
   - ✅ Tour package information
   - ✅ Pricing breakdown
   - ✅ Payment terms
   - ✅ Services included
   - ✅ Cancellation policy
   - ✅ Validity warning
   - ✅ Action buttons (Accept, WhatsApp, PDF, Email)

4. **Test Accept Button:**
   - Click "✓ Accept This Quotation"
   - Confirm in modal
   - See success message
   - Verify status changes to "accepted" in admin panel

### Step 6: Test with Real Email (Optional)

To test actual email sending:

1. **Choose email provider** (SendGrid recommended for testing)

2. **Get API key:**
   - SendGrid: https://app.sendgrid.com/settings/api_keys
   - Free tier: 100 emails/day

3. **Update .env.local:**
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.your-api-key-here
   EMAIL_FROM=noreply@zamzamlankatours.com
   EMAIL_REPLY_TO=info@zamzamlankatours.com
   ```

4. **Restart dev server:**
   ```bash
   # Press Ctrl+C to stop, then:
   npm run dev
   ```

5. **Create new quotation** and send

6. **Check your email inbox** - you should receive professional HTML email

7. **Click "View Full Quotation"** link in email - opens customer view page

## Testing Checklist

### ✅ Quick Quote Form
- [ ] Form opens on homepage
- [ ] All fields validate correctly
- [ ] Date picker prevents past dates
- [ ] Form submits successfully
- [ ] Success message shows quotation number
- [ ] Form resets after submission

### ✅ Admin Panel
- [ ] Login works
- [ ] Quotations page loads
- [ ] Statistics display correctly
- [ ] Quotations table shows data
- [ ] Search works (by name/email/number)
- [ ] Filter by status works
- [ ] Create new quotation modal works
- [ ] Send button works
- [ ] Delete button works

### ✅ Email Functionality
- [ ] Console logging works (development)
- [ ] Real email sends (production)
- [ ] HTML template renders correctly
- [ ] All quotation details appear
- [ ] Links work (View Quotation, Contact)
- [ ] Email received within 1 minute
- [ ] Status updates to 'sent' after sending

### ✅ Customer View Page
- [ ] Page loads with quotation number
- [ ] All sections display correctly
- [ ] Pricing calculation is accurate
- [ ] Accept button works
- [ ] WhatsApp link works
- [ ] Status badges show correctly
- [ ] Validity warnings display
- [ ] View count increments
- [ ] Print layout works

### ✅ Pricing Calculator
- [ ] Base price calculates correctly
- [ ] Group discounts apply (5+, 10+, 15+ pax)
- [ ] Peak season pricing applies (Dec-Mar)
- [ ] Accommodation upgrades calculate
- [ ] Child discounts apply (30% off)
- [ ] Deposit/balance split correctly

## Common Issues & Solutions

### Issue: Quotation form doesn't submit
**Solution:** Check browser console for errors. Ensure all required fields are filled.

### Issue: Email shows in console but not received
**Solution:** You're in development mode. Set EMAIL_PROVIDER to real service in .env.local.

### Issue: SendGrid error "Sender not verified"
**Solution:** Verify sender email in SendGrid dashboard: Settings → Sender Authentication.

### Issue: Quotation view page shows 404
**Solution:** Ensure you're using the full quotation number (e.g., ZZT-2026-0001), not just the ID.

### Issue: Accept button doesn't work
**Solution:** Check browser console and network tab. Ensure API endpoint is responding.

### Issue: Admin panel shows "Unauthorized"
**Solution:** Login again. Check if session expired.

## API Testing (Advanced)

### Test Create Quotation API
```bash
curl -X POST http://localhost:3000/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "API Test Customer",
    "customerEmail": "test@example.com",
    "tourName": "Test Tour - 3 Days",
    "startDate": "2026-03-15",
    "endDate": "2026-03-17",
    "durationDays": 3,
    "numAdults": 2,
    "basePrice": 500
  }'
```

### Test Get Quotations API
```bash
curl http://localhost:3000/api/quotations
```

### Test Get Single Quotation
```bash
curl http://localhost:3000/api/quotations/ZZT-2026-0001
```

### Test Send Email API
```bash
curl -X POST http://localhost:3000/api/quotations/send \
  -H "Content-Type: application/json" \
  -d '{"quotationId": 1}'
```

### Test Update Quotation
```bash
curl -X PUT http://localhost:3000/api/quotations/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

## Performance Testing

### Load Test (100 quotations)
```javascript
// scripts/load-test-quotations.js
for (let i = 0; i < 100; i++) {
  await fetch('http://localhost:3000/api/quotations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: `Test Customer ${i}`,
      customerEmail: `test${i}@example.com`,
      tourName: 'Load Test Tour',
      startDate: '2026-04-01',
      endDate: '2026-04-05',
      durationDays: 5,
      numAdults: 2,
      basePrice: 600
    })
  });
}
```

## Production Testing

Before deploying to production:

1. **Test all workflows** in staging environment
2. **Send test emails** to multiple email providers (Gmail, Outlook, Yahoo)
3. **Test on mobile devices** (responsive design)
4. **Check spam folder** - ensure emails don't go to spam
5. **Verify email deliverability** - check SendGrid/SES analytics
6. **Test with real customer data** (with permission)
7. **Load test** with expected traffic volume
8. **Monitor error logs** for issues

## Monitoring

Track these metrics:
- Quotations created per day
- Emails sent per day
- Conversion rate (accepted / sent)
- Average response time
- Email bounce rate
- Customer actions (views, accepts, declines)

## Success Criteria

System is working correctly if:
- ✅ Quotations create successfully
- ✅ Emails send without errors
- ✅ Customers can view quotations
- ✅ Accept/decline works
- ✅ Admin can manage quotations
- ✅ No database errors
- ✅ No email delivery issues
- ✅ Page load time < 2 seconds
- ✅ Mobile responsive

---

**System Status:** ✅ Ready for testing
**Last Updated:** January 12, 2026

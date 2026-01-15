# Complete Quotation System - Final User Guide

## ✅ All Features Implemented

### Admin Panel Features
1. **Create Custom Quotations**
   - Customer contact details (name, email, phone, country)
   - Tour details (name, dates, duration)
   - Passenger count (adults, children, infants)
   - **Custom pricing per customer**
   - Currency selection (USD, EUR, GBP, LKR)
   - Deposit percentage
   - Accommodation type
   - Included services
   - Special requests
   - Real-time price calculation

2. **Send Quotations**
   - Email automatically sent to customer
   - Professional HTML email template
   - Email preview after sending
   - Status automatically updates to 'sent'

3. **Manage Quotations**
   - View all quotations
   - Filter by status
   - Search by customer/number
   - Track views and acceptances
   - Delete quotations

### Customer View Features
1. **✓ Accept This Quotation** - Customer can accept the quotation
2. **💬 Chat on WhatsApp** - Direct link to WhatsApp chat
3. **📄 Download PDF** - Print/save as PDF using browser
4. **✉️ Email Us** - Email inquiry link

### Complete Workflow

#### Step 1: Admin Creates Quotation
```
http://localhost:3000/admin/quotations
```
1. Click "➕ Create New Quotation"
2. Fill in all fields:
   - Customer Name: John Doe
   - Email: customer@example.com
   - Phone: +1 234 567 8900
   - Tour Name: Cultural Triangle - 5 Days
   - Start Date: (select future date)
   - End Date: (select end date)
   - Adults: 2
   - **Base Price: 600** (customizable!)
   - Currency: USD
   - Deposit %: 30
   - Included Services:
     ```
     Accommodation (4-star hotels)
     All meals (breakfast, lunch, dinner)
     Private air-conditioned vehicle
     English-speaking guide
     All entrance fees
     Airport transfers
     ```
   - Special Requests: Vegetarian meals required

3. Click "Create Quotation"
4. See real-time price calculation
5. Quotation created successfully!

#### Step 2: Admin Sends Email
1. Find quotation in table
2. Click "📧 Send" button
3. Confirm sending
4. Email sent to customer
5. Email preview shown in modal
6. Status changes to 'sent'

#### Step 3: Customer Receives Email
Customer receives professional email with:
- Quotation number (ZZT-2026-0002)
- Tour details
- Pricing breakdown
- Payment terms
- "View Full Quotation" button

#### Step 4: Customer Views Quotation
```
http://localhost:3000/quotation/ZZT-2026-0002
```
Customer sees:
- Complete tour details
- Pricing breakdown
- Payment terms (deposit + balance)
- Services included
- Cancellation policy
- Validity warning
- 4 action buttons

**View tracking:**
- View count increments
- Status changes to 'viewed' (first time)
- first_viewed_at timestamp recorded

#### Step 5: Customer Takes Action

**Option 1: Accept Quotation**
1. Click "✓ Accept This Quotation"
2. Confirm acceptance
3. Success message shown
4. Status changes to 'accepted'
5. Admin can see acceptance in dashboard

**Option 2: Contact via WhatsApp**
1. Click "💬 Chat on WhatsApp"
2. Opens WhatsApp with pre-filled message
3. Customer can chat directly with admin

**Option 3: Download PDF**
1. Click "📄 Download PDF"
2. Browser print dialog opens
3. Save as PDF or print
4. Professional print layout

**Option 4: Email Inquiry**
1. Click "✉️ Email Us"
2. Opens email client
3. Subject: Question about Quotation ZZT-2026-0002
4. Customer can send inquiry

## Testing Checklist

### Admin Panel Tests
- [ ] Create quotation with custom price
- [ ] See price calculation update in real-time
- [ ] Send quotation via email
- [ ] View email preview modal
- [ ] Filter quotations by status
- [ ] Search quotations
- [ ] Delete quotation

### Email Tests
- [ ] Email sent successfully (check terminal logs)
- [ ] Email contains correct details
- [ ] Quotation link works
- [ ] Email HTML renders correctly

### Customer View Tests
- [ ] Page loads correctly
- [ ] All sections display properly
- [ ] Pricing is accurate
- [ ] Accept button works
- [ ] WhatsApp link opens
- [ ] PDF download (print) works
- [ ] Email link works
- [ ] View count increments

### Status Flow Tests
- [ ] draft → sent (after sending email)
- [ ] sent → viewed (after first view)
- [ ] viewed → accepted (after acceptance)

## Environment Setup for Production

### Enable Real Email Sending

**Option 1: SendGrid (Recommended)**
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-api-key-here
EMAIL_FROM=noreply@zamzamlankatours.com
EMAIL_REPLY_TO=info@zamzamlankatours.com
```

**Option 2: Gmail SMTP (Easy)**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://zamzamlankatours.com
NEXT_PUBLIC_EMAIL=info@zamzamlankatours.com
NEXT_PUBLIC_PHONE_NUMBER=+94 77 123 4567
NEXT_PUBLIC_WHATSAPP_NUMBER=+94771234567

# Email Service (choose one)
EMAIL_PROVIDER=sendgrid|smtp|ses|resend
# ... provider-specific credentials
```

## Pricing Calculation

The system automatically calculates:
- **Base Price:** Set by admin per person
- **Subtotal:** Base Price × Number of Adults
- **Accommodation Upgrade:** Based on type selected
- **Discounts:** Can be applied manually
- **Total Amount:** Final price after all adjustments
- **Deposit:** Percentage of total (default 30%)
- **Balance:** Remaining amount

**Example:**
```
Base Price: $600/person
Adults: 2
Children: 1 (30% discount)

Calculation:
Adults: $600 × 2 = $1,200
Children: $600 × 0.7 × 1 = $420
Subtotal: $1,620
Accommodation Upgrade (Deluxe): $50 × 5 nights = $250
Total: $1,870

Deposit (30%): $561
Balance (70%): $1,309
```

## Customer Actions Explained

### 1. Accept Quotation
- Updates status to 'accepted'
- Records accepted_at timestamp
- Admin sees acceptance immediately
- Triggers booking confirmation workflow

### 2. WhatsApp Chat
- Opens WhatsApp Web or App
- Pre-filled message with quotation number
- Direct conversation with admin
- Instant communication

### 3. Download PDF
- Uses browser's print function
- Print-friendly layout
- All buttons hidden in print view
- Can save as PDF from print dialog

### 4. Email Inquiry
- Opens default email client
- Pre-filled subject line
- Sent to configured email address
- Formal communication channel

## Advanced Features

### Email Tracking
- Email sent timestamp
- First view timestamp
- Total view count
- Customer engagement metrics

### Status Lifecycle
```
draft → sent → viewed → accepted
                  ↓
              declined
                  ↓
              expired
```

### Analytics Available
- Total quotations created
- Quotations sent
- Quotations accepted
- Conversion rate (%)
- Average quotation value
- Response time

### Customization Options
- Multiple currencies supported
- Flexible deposit percentages
- Customizable included services
- Special request handling
- Accommodation upgrades
- Group discounts

## Troubleshooting

### Issue: Email not received
**Solution:** 
1. Check terminal logs for email output
2. In development, emails are logged to console
3. To send real emails, configure EMAIL_PROVIDER in .env.local

### Issue: PDF download not working
**Solution:**
1. Use "Download PDF" button (opens print dialog)
2. In print dialog, select "Save as PDF"
3. Or use browser's built-in print to PDF feature

### Issue: Accept button doesn't work
**Solution:**
1. Check browser console for errors
2. Ensure quotation is not expired
3. Verify API endpoint is responding

### Issue: Price calculation wrong
**Solution:**
1. Verify base price is entered correctly
2. Check passenger counts
3. Review accommodation type selection
4. Check for applied discounts

## Support

For issues or questions:
- Check terminal logs for errors
- Review browser console for client-side errors
- Verify environment variables are set
- Ensure database connection is working

---

**System Status:** ✅ Fully Operational
**Last Updated:** January 14, 2026
**Version:** 1.0.0

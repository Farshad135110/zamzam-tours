# Tour Quotation/Estimate System Implementation

## Overview
Implement a professional quotation system similar to Malkey Rent-A-Car's booking estimates for tour packages.

---

## Key Features to Implement

### 1. Quotation Generation
**What to Include:**
- Unique quotation/booking number (e.g., #ZZT-2026-0001)
- Customer details
- Tour package details
- Itemized pricing breakdown
- Terms & conditions
- Validity period
- Payment instructions

### 2. Email Template Structure

```
Subject: Tour Quotation #ZZT-2026-XXXX - [Tour Name]

Dear [Customer Name],

Thank you for your interest in ZamZam Lanka Tours!

Please find below your personalized tour quotation:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUOTATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quotation Number: #ZZT-2026-XXXX
Date: [Date]
Valid Until: [Date + 14 days]
Customer Name: [Name]
Email: [Email]
Phone: [Phone]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOUR PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Package: [Tour Package Name]
Duration: [X Days / Y Nights]
Travel Dates: [Start Date] to [End Date]
Number of Passengers: [Adults: X, Children: Y]

ITINERARY:
Day 1: [Activities]
Day 2: [Activities]
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES INCLUDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Private A/C Vehicle with English-speaking Driver
✓ Accommodation (Double/Twin Rooms)
✓ Daily Breakfast
✓ Airport Pickup & Drop-off
✓ All Fuel, Parking & Highway Charges
✓ Driver Accommodation & Meals
✓ Government Taxes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRICING BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tour Package (per person)          $XXX × [X pax]    $XXX
Accommodation Upgrade                                 $XXX
Single Room Supplement                                $XXX
Additional Excursions                                 $XXX
Entry Fees (Optional)                                 $XXX
                                                   ________
SUBTOTAL                                              $XXX
Discount (XX%)                                      - $XXX
                                                   ________
TOTAL TOUR COST                                     $X,XXX
                                                   ========

Alternative: LKR XXX,XXX
Alternative: EUR X,XXX

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT TERMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deposit (30%):        $XXX  - Due upon booking
Balance (70%):        $XXX  - Due 14 days before arrival

Payment Methods:
• Bank Transfer
• Credit/Debit Card (Stripe)
• PayPal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CANCELLATION POLICY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• 30+ days before: Full refund minus 10% admin fee
• 15-29 days before: 50% refund
• Less than 15 days: No refund
• Deposit is non-refundable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To confirm your booking, please reply to this email or 
contact us via WhatsApp: +94 701 888 993

We look forward to welcoming you to Sri Lanka!

Best regards,
ZamZam Lanka Tours Team
www.zamzamlankatours.com
```

---

## Database Schema

### New Table: `quotations`

```sql
CREATE TABLE IF NOT EXISTS quotations (
    quotation_id SERIAL PRIMARY KEY,
    quotation_number VARCHAR(20) UNIQUE NOT NULL, -- ZZT-2026-0001
    
    -- Customer Info
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_country VARCHAR(50),
    
    -- Tour Details
    package_id VARCHAR(10) REFERENCES package(package_id),
    tour_name VARCHAR(200) NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    
    -- Passenger Info
    num_adults INTEGER DEFAULT 1,
    num_children INTEGER DEFAULT 0,
    
    -- Pricing
    base_price DECIMAL(10,2),
    accommodation_upgrade DECIMAL(10,2) DEFAULT 0,
    additional_services DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, accepted, declined, expired
    valid_until DATE,
    
    -- Customization
    custom_itinerary TEXT,
    special_requests TEXT,
    included_services TEXT[], -- Array of included services
    excluded_services TEXT[], -- Array of excluded services
    
    -- Payment Terms
    deposit_percentage INTEGER DEFAULT 30,
    deposit_amount DECIMAL(10,2),
    balance_amount DECIMAL(10,2),
    
    -- Tracking
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    accepted_at TIMESTAMP,
    created_by VARCHAR(50), -- Admin user who created it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotations_number ON quotations(quotation_number);
CREATE INDEX idx_quotations_email ON quotations(customer_email);
CREATE INDEX idx_quotations_status ON quotations(status);
```

---

## API Endpoints to Create

### 1. `/api/quotations` (POST)
**Create new quotation**

```typescript
// Request body
{
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  packageId: string,
  startDate: string,
  endDate: string,
  numAdults: number,
  numChildren: number,
  customRequests: string,
  currency: 'USD' | 'EUR' | 'LKR'
}

// Response
{
  quotationNumber: "ZZT-2026-0001",
  quotationId: 123,
  totalAmount: 1500,
  validUntil: "2026-02-15"
}
```

### 2. `/api/quotations/[id]` (GET)
**View quotation details**

### 3. `/api/quotations/[id]/send` (POST)
**Send quotation via email**

### 4. `/api/quotations/[id]/accept` (POST)
**Customer accepts quotation (public link)**

### 5. `/api/quotations/generate-pdf` (POST)
**Generate PDF version**

---

## Admin Panel Features

### Quotation Management Page (`/admin/quotations.tsx`)

**Features:**
1. **List All Quotations**
   - Filterable by status (draft, sent, accepted, etc.)
   - Searchable by customer name, email, quotation number
   - Sortable by date, amount

2. **Create New Quotation**
   - Select existing package or create custom
   - Auto-calculate pricing based on:
     - Package base price
     - Number of passengers
     - Duration
     - Season (peak/off-peak)
     - Special discounts
   - Add/remove services
   - Preview before sending

3. **Edit Quotation**
   - Modify pricing
   - Update itinerary
   - Add notes

4. **Send Quotation**
   - Email preview
   - Send to customer
   - Track when opened

5. **Quotation Analytics**
   - Conversion rate (sent → accepted)
   - Average quotation value
   - Popular packages

---

## Customer-Facing Features

### 1. **Quick Quote Request Form**
Add to homepage and tour pages:

```jsx
<QuickQuoteForm>
  - Tour package selection
  - Travel dates
  - Number of travelers
  - Email & phone
  - Special requests
  - Submit → Auto-generates quotation
</QuickQuoteForm>
```

### 2. **View Quotation Page** (`/quotation/[number]`)
Public link: `zamzamlankatours.com/quotation/ZZT-2026-0001`

Features:
- View full quotation details
- Download PDF
- Accept quotation button → Proceed to booking
- Request modifications
- WhatsApp chat link

### 3. **Quotation Acceptance Flow**
```
1. Customer clicks "Accept Quotation"
2. Redirects to booking form (pre-filled)
3. Collect additional details
4. Payment page (deposit)
5. Confirmation email
```

---

## Email Automation

### Automated Emails:

1. **Quotation Sent**
   - Subject: "Your Tour Quotation #ZZT-XXXX"
   - Includes full quotation details
   - Call-to-action: View & Accept

2. **Quotation Reminder** (after 3 days)
   - Subject: "Reminder: Your Sri Lanka Tour Quotation"
   - Gentle reminder
   - Offer to modify

3. **Quotation Expiring Soon** (2 days before expiry)
   - Subject: "Last Chance: Your Quotation Expires Soon"
   - Urgency message

4. **Quotation Accepted**
   - Subject: "Quotation Accepted - Next Steps"
   - Payment instructions
   - What happens next

---

## Pricing Calculator Logic

```typescript
function calculateQuotation(params) {
  const {
    packageId,
    numAdults,
    numChildren,
    duration,
    startDate,
    accommodationType,
    additionalServices
  } = params;

  // Base price from package
  let basePrice = getPackagePrice(packageId);
  
  // Per person pricing
  let adultTotal = basePrice * numAdults;
  let childTotal = (basePrice * 0.7) * numChildren; // 30% discount for children
  
  // Accommodation upgrade
  let accommodationUpgrade = 0;
  if (accommodationType === 'deluxe') {
    accommodationUpgrade = duration * numAdults * 50; // $50/night upgrade
  }
  
  // Seasonal pricing
  let seasonalMultiplier = 1.0;
  if (isHighSeason(startDate)) {
    seasonalMultiplier = 1.2; // 20% increase in peak season
  }
  
  // Additional services
  let additionalCost = calculateAdditionalServices(additionalServices);
  
  // Calculate subtotal
  let subtotal = (adultTotal + childTotal) * seasonalMultiplier + 
                 accommodationUpgrade + 
                 additionalCost;
  
  // Apply discounts
  let discount = calculateDiscount(numAdults, duration, subtotal);
  
  // Final total
  let total = subtotal - discount;
  
  return {
    basePrice: adultTotal + childTotal,
    seasonalAdjustment: subtotal - (adultTotal + childTotal) - accommodationUpgrade,
    accommodationUpgrade,
    additionalServices: additionalCost,
    subtotal,
    discount,
    total,
    depositAmount: total * 0.3,
    balanceAmount: total * 0.7
  };
}
```

---

## Implementation Steps

### Phase 1: Database & Backend (Week 1)
1. Create quotations table
2. Build API endpoints
3. Quotation number generator
4. Pricing calculator logic

### Phase 2: Admin Panel (Week 2)
1. Quotation management page
2. Create/edit quotation form
3. Email sending functionality
4. PDF generation

### Phase 3: Customer Interface (Week 3)
1. Quick quote request form
2. Public quotation view page
3. Quotation acceptance flow
4. Integration with booking system

### Phase 4: Automation & Polish (Week 4)
1. Email automation
2. Analytics dashboard
3. Testing & refinement
4. Documentation

---

## Sample Quotation Number Format

**Format:** `ZZT-YYYY-XXXX`
- `ZZT` = ZamZam Tours
- `YYYY` = Year (2026)
- `XXXX` = Sequential number (0001, 0002, etc.)

Examples:
- ZZT-2026-0001
- ZZT-2026-0234
- ZZT-2026-1567

---

## Additional Features

### 1. **Quotation Templates**
Pre-defined templates for common tours:
- Cultural Triangle (5 Days)
- Hill Country Explorer (7 Days)
- Beach & Wildlife (10 Days)
- Grand Tour (14 Days)

### 2. **Comparison Tool**
Allow customers to compare multiple quotations side-by-side

### 3. **Quotation Modifications**
Customer can request changes:
- Add/remove days
- Change accommodation level
- Add excursions
- System auto-recalculates

### 4. **Group Discounts**
Automatic discount tiers:
- 2-3 people: 5% off
- 4-6 people: 10% off
- 7+ people: 15% off

### 5. **Referral Tracking**
Track how customers found you (Google, TripAdvisor, etc.)

---

## Success Metrics

Track these KPIs:
- Quotation → Booking conversion rate
- Average time to acceptance
- Most popular packages
- Average quotation value
- Seasonal trends
- Abandonment reasons

---

## Cost Estimate to Implement

| Component | Hours | Cost (LKR) |
|-----------|-------|------------|
| Database schema | 4 | 20,000 |
| API development | 12 | 60,000 |
| Admin panel | 16 | 80,000 |
| Email templates | 6 | 30,000 |
| PDF generation | 8 | 40,000 |
| Customer interface | 12 | 60,000 |
| Automation | 8 | 40,000 |
| Testing | 6 | 30,000 |
| **TOTAL** | **72 hrs** | **360,000 LKR** |

**Included in original 500,000 LKR package? Partially (basic quotation system)**
**Full implementation as add-on: 250,000 LKR**

---

This system will give you professional, automated quotations similar to major car rental and tour companies!

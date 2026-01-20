# Invoice System Implementation Guide

## Overview
Complete invoice system integrated with quotations. After payment is received, create an invoice that is automatically sent to customers via email.

## Database Setup

### 1. Run the Schema
Execute the invoice schema in your PostgreSQL database:
```bash
psql -U your_user -d your_database -f database/invoices-schema.sql
```

Or manually create the table using the schema in:
- **File**: `database/invoices-schema.sql`

### Invoice Table Structure
- `invoice_number`: Auto-generated (e.g., INV-2026-0001)
- `quotation_id`: Links to original quotation
- `payment_type`: cash, bank-transfer, card, online
- `paid_amount`: Amount paid by customer
- `invoice_status`: paid, partial, refunded
- `email_sent`: Tracks if invoice was emailed
- Full customer and service details for record-keeping

## Features

### 1. Create Invoice (Admin Panel)
**Location**: Admin Panel → Quotations → Invoice button

**Steps**:
1. View quotation in the list
2. Click **💳 Invoice** button
3. Fill invoice form:
   - Select payment type (bank transfer, cash, card, online)
   - Enter paid amount (quick buttons for deposit/full amount)
   - Add payment reference (optional)
   - Add notes (optional)
4. Click **Create Invoice**

**What Happens**:
- Invoice created with unique number (INV-YYYY-XXXX)
- Option to email invoice to customer
- Option to preview invoice
- Invoice count badge appears next to quotation

### 2. Payment Types
- **Bank Transfer**: For wire transfers, deposit slips
- **Cash**: Cash payments received
- **Credit/Debit Card**: Card payments
- **Online Payment**: PayPal, Stripe, etc.

### 3. Invoice Email
**Automated Email Includes**:
- Professional invoice format
- Invoice number and date
- Customer details
- Service information (tour/vehicle/hotel)
- Payment details with type and reference
- Pricing breakdown (total, deposit, remaining, paid)
- Balance due (if partial payment)
- Payment type and method
- Company branding

**Trigger**: After creating invoice, admin is prompted to send email

### 4. Customer Invoice View
**URL Format**: `/invoice/INV-2026-0001`

**Features**:
- Clean, professional layout
- Print-ready format
- All payment and service details
- Payment status badge (Paid/Partial)
- Balance due highlighted if applicable

## API Endpoints

### Create Invoice
```
POST /api/invoices
```

**Request Body**:
```json
{
  "quotationId": 123,
  "paymentType": "bank-transfer",
  "paymentReference": "TXN-12345",
  "paidAmount": 300.00,
  "notes": "Deposit payment received",
  "createdBy": "admin"
}
```

**Response**:
```json
{
  "message": "Invoice created successfully",
  "invoice": {
    "invoice_number": "INV-2026-0001",
    "quotation_id": 123,
    "paid_amount": 300.00,
    ...
  }
}
```

### Get Invoices
```
GET /api/invoices
GET /api/invoices?quotationId=123
GET /api/invoices?invoiceNumber=INV-2026-0001
```

### Send Invoice Email
```
POST /api/invoices/send
```

**Request Body**:
```json
{
  "invoiceNumber": "INV-2026-0001"
}
```

## Usage Workflow

### Standard Payment Flow
1. **Quotation Created** → Admin creates quotation for customer
2. **Quotation Sent** → Customer receives quotation email
3. **Customer Pays** → Payment received (deposit or full)
4. **Create Invoice** → Admin creates invoice with payment details
5. **Send Invoice** → Customer receives professional invoice
6. **Service Delivered** → Travel service provided
7. **(Optional) Final Payment** → If deposit was paid, create second invoice for balance

### Partial Payment Example
1. Quotation Total: $1000
2. Deposit (30%): $300
3. **First Invoice**: Create for $300 deposit payment
   - Status: "partial"
   - Balance Due: $700 shown
4. **Second Invoice**: Create for $700 final payment
   - Status: "paid"
   - Balance Due: $0

## Admin Panel Integration

### Quotations Table
- **💳 Invoice Button**: Create new invoice for quotation
- **Invoice Badge**: Shows count of invoices created (e.g., "2 Invoices")
- Quick access to create multiple invoices for partial payments

### Invoice Modal
- Pre-filled quotation details
- Pricing summary (total, deposit, balance)
- Payment type selector
- Quick amount buttons (deposit/full)
- Payment reference field
- Notes field

## Email Configuration

Invoices use the same email service as quotations.

**Required Environment Variables**:
```env
EMAIL_PROVIDER=sendgrid  # or ses, resend, smtp
SENDGRID_API_KEY=your_key
EMAIL_FROM=noreply@zamzamtours.com
EMAIL_REPLY_TO=info@zamzamtours.com
```

See `EMAIL_SETUP_GUIDE.md` for detailed email setup.

## Customization

### Invoice Number Format
Current: `INV-YYYY-XXXX` (e.g., INV-2026-0001)

To change format, edit:
```typescript
// File: pages/api/invoices/index.ts
const invoiceNumber = `INV-${year}-${String(count).padStart(4, '0')}`;
```

### Company Information
Update company details in email template:
```typescript
// File: pages/api/invoices/send.ts
// Search for "ZamZam Tours" and update
```

### Payment Types
Add/remove payment types in:
```typescript
// Admin modal: pages/admin/quotations.tsx (InvoiceModal component)
<option value="bank-transfer">Bank Transfer</option>
<option value="cash">Cash</option>
// Add more options here
```

## Security Notes

1. **Invoice URLs**: Not indexed by search engines (noindex meta tag)
2. **Admin Only Creation**: Only admins can create invoices
3. **Database Constraints**: Foreign key ensures invoice links to valid quotation
4. **Audit Trail**: Created_at, updated_at, created_by tracked

## Testing

### Manual Test Flow
1. Create a test quotation
2. Click Invoice button
3. Select "Bank Transfer"
4. Enter test amount (use deposit button)
5. Add reference "TEST-001"
6. Create invoice
7. Send email (check inbox)
8. Visit invoice URL
9. Test print functionality

### Database Verification
```sql
-- Check invoices created
SELECT * FROM invoices ORDER BY created_at DESC LIMIT 10;

-- Check invoices for specific quotation
SELECT * FROM invoices WHERE quotation_id = 123;

-- Check email send status
SELECT invoice_number, email_sent, email_sent_at 
FROM invoices 
WHERE email_sent = true;
```

## Troubleshooting

### Invoice Not Creating
- Check quotation exists in database
- Verify paid amount is valid number
- Check PostgreSQL logs for errors

### Email Not Sending
- Verify email service configuration
- Check `EMAIL_PROVIDER` environment variable
- Review email service credentials
- Check invoice `email_sent` flag in database

### Invoice Not Displaying
- Verify invoice number is correct
- Check invoice exists: `SELECT * FROM invoices WHERE invoice_number = 'INV-2026-0001'`
- Review browser console for errors

## Files Modified/Created

### New Files
- `database/invoices-schema.sql` - Database schema
- `pages/api/invoices/index.ts` - Invoice CRUD API
- `pages/api/invoices/send.ts` - Email sending API
- `pages/invoice/[number].tsx` - Customer invoice view
- `INVOICE_SYSTEM_GUIDE.md` - This documentation

### Modified Files
- `pages/admin/quotations.tsx` - Added invoice creation UI

## Future Enhancements

Potential additions:
- PDF invoice generation
- Automatic invoice creation on payment
- Payment gateway integration
- Invoice templates customization
- Multi-currency support
- Tax calculations
- Invoice history/audit log view
- Bulk invoice creation
- Payment reminders for partial payments

## Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Verify database schema
4. Check email configuration
5. Review API responses in browser dev tools

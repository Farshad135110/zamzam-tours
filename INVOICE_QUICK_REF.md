# Invoice System - Quick Reference

## Setup (One-time)
```bash
# 1. Create invoice table
psql -U user -d database -f database/invoices-schema.sql

# 2. Verify table created
psql -U user -d database -c "SELECT COUNT(*) FROM invoices;"
```

## Create Invoice (Admin Panel)

1. **Navigate**: Admin Panel → Quotations
2. **Select**: Find quotation → Click **💳 Invoice**
3. **Fill Form**:
   - Payment Type: bank-transfer / cash / card / online
   - Paid Amount: Enter amount (or click quick buttons)
   - Reference: Transaction ID (optional)
   - Notes: Additional info (optional)
4. **Submit**: Click "Create Invoice"
5. **Send**: Choose to email customer (Yes/No)
6. **Preview**: View invoice (optional)

## Quick Actions

### Create Deposit Invoice
- Amount: Click "Set Deposit (30%)" button
- Reference: Bank transfer ID
- Notes: "Deposit payment received"

### Create Full Payment Invoice  
- Amount: Click "Set Full Amount" button
- Reference: Payment confirmation
- Notes: "Full payment received"

### Partial Payment (Multiple Invoices)
**First Invoice** (Deposit):
- Paid: $300 (30% of $1000)
- Status: partial

**Second Invoice** (Balance):
- Paid: $700 (remaining 70%)
- Status: paid

## View Invoice

**Admin**: Admin panel shows invoice count badge
**Customer**: Email contains invoice link → `/invoice/INV-2026-0001`

## Payment Types

| Type | Use For |
|------|---------|
| **bank-transfer** | Wire transfers, bank deposits |
| **cash** | Cash payments in person |
| **card** | Credit/debit card payments |
| **online** | PayPal, Stripe, online gateways |

## Invoice URLs

- Customer View: `https://yoursite.com/invoice/INV-2026-0001`
- Print: Customer view page has Print button
- Email: Automatically formatted professional invoice

## Email Template

Includes:
- Invoice number & date
- Customer info
- Service details
- Payment method & reference
- Amount breakdown
- Balance due (if partial)
- Company branding

## Database Queries

```sql
-- Get all invoices
SELECT * FROM invoices ORDER BY created_at DESC;

-- Get invoices for quotation
SELECT * FROM invoices WHERE quotation_id = 123;

-- Get specific invoice
SELECT * FROM invoices WHERE invoice_number = 'INV-2026-0001';

-- Check email status
SELECT invoice_number, customer_email, email_sent, email_sent_at 
FROM invoices 
WHERE email_sent = true;

-- Total revenue
SELECT SUM(paid_amount) as total_revenue FROM invoices;

-- Partial vs Full payments
SELECT invoice_status, COUNT(*) 
FROM invoices 
GROUP BY invoice_status;
```

## API Endpoints

### Create
```bash
POST /api/invoices
{
  "quotationId": 123,
  "paymentType": "bank-transfer",
  "paidAmount": 300,
  "paymentReference": "TXN-123",
  "notes": "Deposit"
}
```

### List
```bash
GET /api/invoices
GET /api/invoices?quotationId=123
GET /api/invoices?invoiceNumber=INV-2026-0001
```

### Send Email
```bash
POST /api/invoices/send
{ "invoiceNumber": "INV-2026-0001" }
```

## Common Scenarios

### Scenario 1: Full Payment Upfront
1. Create quotation
2. Customer pays full amount
3. Create invoice: paid_amount = total_amount
4. Status: "paid"

### Scenario 2: Deposit First
1. Create quotation ($1000)
2. Customer pays 30% deposit ($300)
3. Create invoice: paid_amount = $300
4. Status: "partial" (balance $700 shown)

### Scenario 3: Deposit + Balance
1. Create quotation ($1000)
2. **Invoice 1**: Deposit $300
3. Service starts
4. **Invoice 2**: Balance $700
5. Both invoices linked to same quotation

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't create invoice | Check quotation exists, verify database connection |
| Email not sending | Verify EMAIL_PROVIDER env var, check credentials |
| Invoice not found | Verify invoice_number, check database |
| Wrong amount calculated | Check deposit_percentage in quotation |

## Files to Know

- **Schema**: `database/invoices-schema.sql`
- **API Create**: `pages/api/invoices/index.ts`
- **API Email**: `pages/api/invoices/send.ts`
- **Customer View**: `pages/invoice/[number].tsx`
- **Admin UI**: `pages/admin/quotations.tsx` (InvoiceModal)

## Tips

✅ **Always** add payment reference for tracking
✅ **Use** quick buttons for common amounts
✅ **Send** invoice immediately after creation
✅ **Print** invoice for customer records
✅ **Track** partial payments with multiple invoices

❌ **Don't** create invoice before payment received
❌ **Don't** forget to send email to customer
❌ **Don't** create duplicate invoices for same payment

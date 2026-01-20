import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { sendEmail } from '../../../lib/emailService';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = await pool.connect();
  
  try {
    const { invoiceNumber } = req.body;

    if (!invoiceNumber) {
      return res.status(400).json({ error: 'Invoice number is required' });
    }

    // Fetch invoice details
    const invoiceResult = await client.query(
      `SELECT * FROM invoices WHERE invoice_number = $1`,
      [invoiceNumber]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = invoiceResult.rows[0];
    
    // Generate email content
    const emailHtml = generateInvoiceEmailTemplate(invoice);
    const emailSubject = `Invoice ${invoice.invoice_number} - ZamZam Lanka Tours`;

    // Send email
    await sendEmail({
      to: invoice.customer_email,
      subject: emailSubject,
      html: emailHtml
    });

    // Update invoice email status
    await client.query(
      `UPDATE invoices SET email_sent = true, email_sent_at = CURRENT_TIMESTAMP WHERE invoice_number = $1`,
      [invoiceNumber]
    );

    return res.status(200).json({
      message: 'Invoice sent successfully',
      email: invoice.customer_email
    });

  } catch (error) {
    console.error('Error sending invoice:', error);
    return res.status(500).json({ 
      error: 'Failed to send invoice',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
}

function generateInvoiceEmailTemplate(invoice: any): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zamzamlankatours.com';
  
  const serviceDetails = typeof invoice.service_details === 'string' 
    ? JSON.parse(invoice.service_details) 
    : invoice.service_details;

  // Parse numeric values (database returns them as strings)
  const totalAmount = parseFloat(invoice.total_amount) || 0;
  const paidAmount = parseFloat(invoice.paid_amount) || 0;
  const depositAmount = parseFloat(invoice.deposit_amount) || 0;
  const remainingAmount = parseFloat(invoice.remaining_amount) || 0;
  const depositPercentage = parseFloat(invoice.deposit_percentage) || 30;
  const balanceDue = totalAmount - paidAmount;

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'cash': 'Cash Payment',
      'bank-transfer': 'Bank Transfer',
      'card': 'Credit/Debit Card',
      'online': 'Online Payment'
    };
    return types[type] || type;
  };

  const getServiceName = () => {
    if (invoice.service_type === 'tour') {
      return serviceDetails.package_name || 'Tour Package';
    } else if (invoice.service_type === 'vehicle') {
      return serviceDetails.vehicle_name || 'Vehicle Rental';
    } else if (invoice.service_type === 'hotel') {
      return serviceDetails.hotel_name || 'Hotel Accommodation';
    }
    return 'Service';
  };

  const getServiceTypeLabel = () => {
    if (invoice.service_type === 'tour') {
      return 'Tour Package';
    } else if (invoice.service_type === 'vehicle') {
      return 'Vehicle Rental';
    } else if (invoice.service_type === 'hotel') {
      return 'Hotel Accommodation';
    }
    return invoice.service_type.charAt(0).toUpperCase() + invoice.service_type.slice(1);
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number} - ZamZam Lanka Tours</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <img src="https://res.cloudinary.com/dhqhxma30/image/upload/v1767556814/Project_Luvi_-_Gemstones_j2ipqf.png" alt="ZamZam Lanka Tours" style="height: 60px; margin-bottom: 15px;" />
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">ZamZam Lanka Tours</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Payment Invoice</p>
            </td>
          </tr>

          <!-- Invoice Number -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center; background-color: #f9fafb;">
              <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">Payment Received - Thank You!</h2>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Invoice Number: <strong style="color: #10b981;">${invoice.invoice_number}</strong></p>
            </td>
          </tr>

          <!-- Customer Details -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 15px 0; color: #374151;">Dear <strong>${invoice.customer_name}</strong>,</p>
              <p style="margin: 0 0 20px 0; color: #374151; line-height: 1.6;">
                Thank you for your payment! This invoice confirms your payment for the booking with quotation reference <strong>${invoice.quotation_number}</strong>.
              </p>
            </td>
          </tr>

          <!-- Service Summary -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px;">
                <tr>
                  <td colspan="2" style="padding: 15px; border-bottom: 2px solid #10b981;">
                    <h3 style="margin: 0; color: #111827; font-size: 18px;">${getServiceName()}</h3>
                  </td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 10px 15px;"><strong>Service Type:</strong></td>
                  <td style="color: #111827; padding: 10px 15px;">${getServiceTypeLabel()}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="color: #6b7280; padding: 10px 15px;"><strong>Service Dates:</strong></td>
                  <td style="color: #111827; padding: 10px 15px;">
                    ${formatDate(invoice.service_start_date)}
                    ${invoice.service_end_date ? ` to ${formatDate(invoice.service_end_date)}` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 10px 15px;"><strong>Invoice Date:</strong></td>
                  <td style="color: #111827; padding: 10px 15px;">${formatDate(invoice.payment_date)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Information -->
          <tr>
            <td style="padding: 20px 40px; background-color: #ecfdf5; border-left: 4px solid #10b981;">
              <p style="margin: 0 0 10px 0; color: #065f46; font-weight: 600;">Payment Details:</p>
              <p style="margin: 0 0 5px 0; color: #047857;">
                <strong>Payment Method:</strong> ${getPaymentTypeLabel(invoice.payment_type)}
              </p>
              <p style="margin: 0 0 5px 0; color: #047857;">
                <strong>Payment Date:</strong> ${formatDate(invoice.payment_date)}
              </p>
              ${invoice.payment_reference ? `
                <p style="margin: 0; color: #047857;">
                  <strong>Reference Number:</strong> ${invoice.payment_reference}
                </p>
              ` : ''}
            </td>
          </tr>

          <!-- Pricing -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; padding: 8px 0;">Total Service Cost</td>
                  <td align="right" style="color: #111827; font-weight: 600; padding: 8px 0;">$ ${totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0;">Deposit (${depositPercentage}%)</td>
                  <td align="right" style="color: #111827; font-weight: 600; padding: 8px 0;">$ ${depositAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 8px 0;">Remaining Balance</td>
                  <td align="right" style="color: #111827; font-weight: 600; padding: 8px 0;">$ ${remainingAmount.toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="color: #10b981; font-size: 18px; font-weight: bold; padding: 15px 0 8px 0;">AMOUNT PAID</td>
                  <td align="right" style="color: #10b981; font-size: 24px; font-weight: bold; padding: 15px 0 8px 0;">$ ${paidAmount.toFixed(2)}</td>
                </tr>
                ${balanceDue > 0 ? `
                <tr>
                  <td style="color: #d97706; font-size: 16px; font-weight: bold; padding: 8px 0;">BALANCE DUE</td>
                  <td align="right" style="color: #d97706; font-size: 20px; font-weight: bold; padding: 8px 0;">$ ${balanceDue.toFixed(2)}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          ${balanceDue > 0 ? `
          <!-- Balance Due Notice -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fffbeb; border-left: 4px solid #f59e0b;">
              <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 600;">⚠️ Outstanding Balance:</p>
              <p style="margin: 0; color: #78350f;">
                Please pay the remaining balance of <strong>$ ${balanceDue.toFixed(2)}</strong> before your service date.
              </p>
            </td>
          </tr>
          ` : `
          <!-- Fully Paid Notice -->
          <tr>
            <td style="padding: 20px 40px; background-color: #d1fae5; border-left: 4px solid #10b981; text-align: center;">
              <p style="margin: 0; color: #065f46; font-weight: 600; font-size: 16px;">✓ Payment Complete - Thank You!</p>
            </td>
          </tr>
          `}

          ${invoice.notes ? `
          <!-- Notes -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb;">
              <p style="margin: 0 0 10px 0; color: #374151; font-weight: 600;">Additional Notes:</p>
              <p style="margin: 0; color: #6b7280; line-height: 1.6;">${invoice.notes}</p>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Buttons -->
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/invoice/${invoice.invoice_number}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 5px;">
                      View Invoice Online
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/contact" style="display: inline-block; background-color: #6b7280; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 5px;">
                      Contact Us
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #111827; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: 600;">ZamZam Lanka Tours</p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">Your Trusted Travel Partner in Sri Lanka</p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                📧 reservation@zamzamlankatours.com | 
                📱 +94 70 188 8993
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

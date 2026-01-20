// API endpoint for sending quotation via email
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { sendEmail, createQuotationEmailHTML } from '../../../lib/emailService';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { quotationId } = req.body;

  if (!quotationId) {
    return res.status(400).json({ error: 'Quotation ID is required' });
  }

  try {
    // Get quotation details
    const quotationQuery = 'SELECT * FROM quotations WHERE quotation_id = $1';
    const quotationResult = await pool.query(quotationQuery, [quotationId]);

    if (quotationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const quotation = quotationResult.rows[0];

    // Generate email content using new email service
    const emailHtml = createQuotationEmailHTML(quotation);
    const emailSubject = `Tour Itinerary ${quotation.quotation_number} - ${quotation.tour_name}`;

    // Send email using configured email service
    const emailResult = await sendEmail({
      to: quotation.customer_email,
      subject: emailSubject,
      html: emailHtml,
      replyTo: process.env.NEXT_PUBLIC_EMAIL,
      bcc: 'zamzamlankatours.com+9719517be2@invite.trustpilot.com' // Trustpilot review invitation
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        error: `Failed to send email: ${emailResult.error}`
      });
    }

    console.log('Email sent successfully. Message ID:', emailResult.messageId);

    // Update quotation status to 'sent'
    const updateQuery = `
      UPDATE quotations
      SET 
        status = 'sent',
        sent_at = CURRENT_TIMESTAMP
      WHERE quotation_id = $1
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, [quotationId]);

    return res.status(200).json({
      success: true,
      quotation: updateResult.rows[0],
      message: 'Quotation sent successfully',
      messageId: emailResult.messageId,
      emailPreview: emailHtml
    });

  } catch (error) {
    console.error('Error sending quotation:', error);
    return res.status(500).json({ error: 'Failed to send quotation' });
  }
}

// Generate HTML email template
function generateQuotationEmail(quotation: any): string {
  const {
    quotation_number,
    customer_name,
    tour_name,
    start_date,
    end_date,
    duration_days,
    num_adults,
    num_children,
    base_price,
    accommodation_upgrade,
    discount_amount,
    discount_percentage,
    subtotal,
    total_amount,
    currency,
    deposit_amount,
    deposit_percentage,
    balance_amount,
    valid_until,
    included_services,
    special_requests
  } = quotation;

  const viewUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/quotation/${quotation_number}`;
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=94701888993&text=${encodeURIComponent(`Hi, I have a question about quotation ${quotation_number}`)}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tour Itinerary ${quotation_number}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section-title { font-size: 18px; font-weight: bold; color: #059669; margin-bottom: 15px; border-bottom: 2px solid #059669; padding-bottom: 8px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .info-label { font-weight: 600; color: #6b7280; }
    .info-value { color: #111827; }
    .price-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; }
    .price-total { font-size: 24px; font-weight: bold; color: #059669; border-top: 2px solid #059669; padding-top: 15px; margin-top: 15px; }
    .included-list { list-style: none; padding: 0; }
    .included-list li { padding: 8px 0; padding-left: 25px; position: relative; }
    .included-list li:before { content: "✓"; position: absolute; left: 0; color: #059669; font-weight: bold; }
    .cta-button { display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 10px 5px; font-weight: bold; }
    .cta-button:hover { background: #047857; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .validity { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin:0;">ZamZam Lanka Tours</h1>
    <p style="margin:5px 0;">Your Journey to Sri Lanka Begins Here</p>
  </div>

  <div class="content">
    <p>Dear ${customer_name},</p>
    <p>Thank you for your interest in ZamZam Lanka Tours! We are delighted to provide you with a personalized quotation for your Sri Lankan adventure.</p>

    <div class="validity">
      <strong>⏰ This quotation is valid until ${new Date(valid_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
    </div>

    <!-- Quotation Details -->
    <div class="section">
      <div class="section-title">📋 Quotation Details</div>
      <div class="info-row">
        <span class="info-label">Quotation Number:</span>
        <span class="info-value"><strong>${quotation_number}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">Date Issued:</span>
        <span class="info-value">${new Date().toLocaleDateString()}</span>
      </div>
    </div>

    <!-- Tour Package -->
    <div class="section">
      <div class="section-title">🌴 Tour Package</div>
      <div class="info-row">
        <span class="info-label">Package:</span>
        <span class="info-value"><strong>${tour_name}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">Duration:</span>
        <span class="info-value">${duration_days} Days / ${duration_days - 1} Nights</span>
      </div>
      <div class="info-row">
        <span class="info-label">Travel Dates:</span>
        <span class="info-value">${new Date(start_date).toLocaleDateString()} to ${new Date(end_date).toLocaleDateString()}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Passengers:</span>
        <span class="info-value">
          ${num_adults} Adult${num_adults > 1 ? 's' : ''}
          ${num_children > 0 ? ` + ${num_children} Child${num_children > 1 ? 'ren' : ''}` : ''}
        </span>
      </div>
      ${special_requests ? `
      <div class="info-row">
        <span class="info-label">Special Requests:</span>
        <span class="info-value">${special_requests}</span>
      </div>
      ` : ''}
    </div>

    <!-- Services Included -->
    <div class="section">
      <div class="section-title">✓ Services Included</div>
      <ul class="included-list">
        ${included_services ? included_services.map((service: string) => `<li>${service}</li>`).join('') : ''}
      </ul>
    </div>

    <!-- Pricing -->
    <div class="section">
      <div class="section-title">💰 Pricing Breakdown</div>
      <div class="price-row">
        <span>Tour Package (${num_adults} Adult${num_adults > 1 ? 's' : ''}${num_children > 0 ? ` + ${num_children} Child${num_children > 1 ? 'ren' : ''}` : ''})</span>
        <span>${currency} ${base_price.toFixed(2)}</span>
      </div>
      ${accommodation_upgrade > 0 ? `
      <div class="price-row">
        <span>Accommodation Upgrade</span>
        <span>${currency} ${accommodation_upgrade.toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="price-row" style="border-top: 1px solid #e5e7eb; margin-top: 10px; padding-top: 10px;">
        <span><strong>Subtotal</strong></span>
        <span><strong>${currency} ${subtotal.toFixed(2)}</strong></span>
      </div>
      ${discount_amount > 0 ? `
      <div class="price-row" style="color: #059669;">
        <span>Discount (${discount_percentage}%)</span>
        <span>- ${currency} ${discount_amount.toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="price-row price-total">
        <span>TOTAL TOUR COST</span>
        <span>${currency} ${total_amount.toFixed(2)}</span>
      </div>
    </div>

    <!-- Payment Terms -->
    <div class="section">
      <div class="section-title">💳 Payment Terms</div>
      <div class="price-row">
        <span>Deposit (${deposit_percentage || 30}%):</span>
        <span><strong>${currency} ${deposit_amount.toFixed(2)}</strong></span>
      </div>
      <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Due upon booking confirmation</p>
      <div class="price-row" style="margin-top: 15px;">
        <span>Balance (${100 - (deposit_percentage || 30)}%):</span>
        <span><strong>${currency} ${balance_amount.toFixed(2)}</strong></span>
      </div>
      <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Due 14 days before tour commencement</p>
      
      <p style="margin-top: 20px;"><strong>Accepted Payment Methods:</strong></p>
      <ul style="color: #6b7280;">
        <li>Bank Transfer</li>
        <li>Credit/Debit Card (Visa, Mastercard)</li>
      </ul>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; padding: 20px;">
      <a href="${viewUrl}" class="cta-button" style="color: white;">📄 View Full Quotation</a>
      <a href="${whatsappUrl}" class="cta-button" style="color: white; background: #25D366;">💬 Chat on WhatsApp</a>
    </div>

    <!-- Cancellation Policy -->
    <div class="section">
      <div class="section-title">📜 Cancellation Policy</div>
      <ul style="color: #6b7280; font-size: 14px;">
        <li>30+ days before tour: Full refund minus 10% admin fee</li>
        <li>15-29 days before: 50% refund</li>
        <li>Less than 15 days: No refund</li>
        <li>Deposit is non-refundable</li>
      </ul>
    </div>

    <p>We look forward to welcoming you to beautiful Sri Lanka and creating unforgettable memories!</p>
    
    <p>If you have any questions or would like to modify this quotation, please don't hesitate to contact us.</p>

    <p>Best regards,<br>
    <strong>ZamZam Lanka Tours Team</strong></p>
  </div>

  <div class="footer">
    <p><strong>ZamZam Lanka Tours</strong></p>
    <p>Email: info@zamzamlankatours.com | Phone: ${process.env.NEXT_PUBLIC_PHONE_NUMBER}</p>
    <p>WhatsApp: ${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}</p>
    <p>Website: www.zamzamlankatours.com</p>
    <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">
      This quotation was generated automatically. Please do not reply directly to this email.<br>
      Use the buttons above to view your quotation or contact us.
    </p>
  </div>
</body>
</html>
  `;
}

// API endpoint for individual quotation operations
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { sendEmail } from '../../../lib/emailService';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req;

  if (!id) {
    return res.status(400).json({ error: 'Quotation ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        return await getQuotation(id as string, req, res);
      case 'PUT':
        return await updateQuotation(id as string, req, res);
      case 'DELETE':
        return await deleteQuotation(id as string, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Quotation API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/quotations/[id] - Get single quotation
async function getQuotation(id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    // Support both numeric ID and quotation number
    // Check if id is numeric or a quotation number format
    const isNumeric = /^\d+$/.test(id);
    
    const query = isNumeric
      ? `SELECT * FROM quotations WHERE quotation_id = $1`
      : `SELECT * FROM quotations WHERE quotation_number = $1`;

    const result = await pool.query(query, [isNumeric ? parseInt(id) : id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const quotation = result.rows[0];

    // Track view if not from admin
    const { trackView } = req.query;
    if (trackView === 'true' && quotation.status === 'sent') {
      const updateViewQuery = `
        UPDATE quotations
        SET 
          viewed_at = CURRENT_TIMESTAMP,
          first_viewed_at = COALESCE(first_viewed_at, CURRENT_TIMESTAMP),
          view_count = view_count + 1,
          status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END
        WHERE quotation_id = $1
      `;
      await pool.query(updateViewQuery, [quotation.quotation_id]);
    }

    return res.status(200).json({ quotation });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return res.status(500).json({ error: 'Failed to fetch quotation' });
  }
}

// PUT /api/quotations/[id] - Update quotation
async function updateQuotation(id: string, req: NextApiRequest, res: NextApiResponse) {
  const updates = req.body;

  try {
    // Build dynamic update query
    const allowedFields = [
      'customer_name', 'customer_email', 'customer_phone', 'customer_country',
      'tour_name', 'start_date', 'end_date', 'duration_days',
      'num_adults', 'num_children', 'num_infants',
      'base_price', 'accommodation_type', 'accommodation_upgrade',
      'discount_amount', 'discount_percentage', 'discount_reason',
      'subtotal', 'total_amount', 'currency',
      'deposit_amount', 'balance_amount',
      'status', 'valid_until',
      'included_services', 'excluded_services',
      'custom_itinerary', 'special_requests', 'admin_notes',
      'last_modified_by'
    ];

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Support both numeric ID and quotation number
    const isNumeric = /^\d+$/.test(id);
    values.push(isNumeric ? parseInt(id) : id);

    const whereClause = isNumeric
      ? `quotation_id = $${paramCount}`
      : `quotation_number = $${paramCount}`;

    const query = `
      UPDATE quotations
      SET ${updateFields.join(', ')}
      WHERE ${whereClause}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const updatedQuotation = result.rows[0];

    // Send email notifications if quotation was accepted
    if (updates.status === 'accepted') {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zamzamlankatours.com';
        const quotationUrl = `${siteUrl}/quotation/${updatedQuotation.quotation_number}`;
        const adminEmail = process.env.NEXT_PUBLIC_EMAIL || 'info@zamzamlankatours.com';
        
        // Send notification to admin
        await sendEmail({
          to: adminEmail,
          subject: `🎉 Quotation Accepted: ${updatedQuotation.quotation_number}`,
          html: createAdminNotificationEmail(updatedQuotation, quotationUrl)
        });

        // Send confirmation to customer
        await sendEmail({
          to: updatedQuotation.customer_email,
          subject: `Quotation Accepted - ${updatedQuotation.tour_name} | ZamZam Lanka Tours`,
          html: createCustomerConfirmationEmail(updatedQuotation, quotationUrl)
        });
      } catch (emailError) {
        console.error('Error sending acceptance emails:', emailError);
        // Don't fail the request if emails fail
      }
    }

    return res.status(200).json({
      success: true,
      quotation: updatedQuotation,
      message: 'Quotation updated successfully'
    });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return res.status(500).json({ error: 'Failed to update quotation' });
  }
}

// DELETE /api/quotations/[id] - Delete quotation
async function deleteQuotation(id: string, res: NextApiResponse) {
  try {
    // Support both numeric ID and quotation number
    const isNumeric = /^\d+$/.test(id);
    
    const query = isNumeric
      ? `DELETE FROM quotations WHERE quotation_id = $1 RETURNING quotation_number`
      : `DELETE FROM quotations WHERE quotation_number = $1 RETURNING quotation_number`;

    const result = await pool.query(query, [isNumeric ? parseInt(id) : id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    return res.status(200).json({
      success: true,
      deletedQuotationNumber: result.rows[0].quotation_number,
      message: 'Quotation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return res.status(500).json({ error: 'Failed to delete quotation' });
  }
}

// Email template for admin notification
function createAdminNotificationEmail(quotation: any, quotationUrl: string): string {
  const totalAmount = parseFloat(quotation.total_amount).toFixed(2);
  const depositAmount = parseFloat(quotation.deposit_amount).toFixed(2);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">🎉 Quotation Accepted!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px;">
                Great news! A customer has accepted quotation <strong>${quotation.quotation_number}</strong>
              </p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 6px;">
                <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px;">Customer Details</h3>
                <p style="margin: 5px 0; color: #047857; font-size: 14px;"><strong>Name:</strong> ${quotation.customer_name}</p>
                <p style="margin: 5px 0; color: #047857; font-size: 14px;"><strong>Email:</strong> ${quotation.customer_email}</p>
                <p style="margin: 5px 0; color: #047857; font-size: 14px;"><strong>Phone:</strong> ${quotation.customer_phone}</p>
              </div>

              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 6px;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Tour Details</h3>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Tour:</strong> ${quotation.tour_name}</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Duration:</strong> ${quotation.duration_days} days</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Start Date:</strong> ${new Date(quotation.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Travelers:</strong> ${quotation.num_adults} Adults${quotation.num_children > 0 ? `, ${quotation.num_children} Children` : ''}${quotation.num_infants > 0 ? `, ${quotation.num_infants} Infants` : ''}</p>
              </div>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 6px;">
                <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">Pricing</h3>
                <p style="margin: 5px 0; color: #92400e; font-size: 14px;"><strong>Total Amount:</strong> ${quotation.currency} ${totalAmount}</p>
                <p style="margin: 5px 0; color: #92400e; font-size: 14px;"><strong>Deposit Required:</strong> ${quotation.currency} ${depositAmount}</p>
                <p style="margin: 5px 0; color: #92400e; font-size: 14px;"><strong>Deposit Due:</strong> ${new Date(quotation.deposit_due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <table width="100%" cellpadding="10" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${quotationUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      View Quotation
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 6px;">
                <p style="margin: 0; color: #991b1b; font-size: 13px;">
                  <strong>Action Required:</strong> Contact the customer to confirm booking details and send payment instructions.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #111827; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">ZamZam Lanka Tours Admin System</p>
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

// Email template for customer confirmation
function createCustomerConfirmationEmail(quotation: any, quotationUrl: string): string {
  const totalAmount = parseFloat(quotation.total_amount).toFixed(2);
  const depositAmount = parseFloat(quotation.deposit_amount).toFixed(2);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zamzamlankatours.com';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <img src="https://res.cloudinary.com/dhqhxma30/image/upload/v1767556814/Project_Luvi_-_Gemstones_j2ipqf.png" alt="ZamZam Lanka Tours" style="height: 60px; margin-bottom: 15px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Thank You!</h1>
              <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">We've received your quotation acceptance</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Dear <strong>${quotation.customer_name}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                Thank you for accepting our quotation for <strong>${quotation.tour_name}</strong>! We're thrilled to help you explore the beauty of Sri Lanka.
              </p>

              <div style="background-color: #f0fdf4; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h2 style="margin: 0 0 20px 0; color: #065f46; font-size: 20px; font-weight: bold;">What Happens Next?</h2>
                <div style="margin: 15px 0;">
                  <div style="display: flex; margin-bottom: 15px;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">1️⃣</span>
                    <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                      Our team will contact you within <strong>24 hours</strong> with detailed booking instructions
                    </p>
                  </div>
                  <div style="display: flex; margin-bottom: 15px;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">2️⃣</span>
                    <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                      You'll receive payment details for the deposit of <strong>${quotation.currency} ${depositAmount}</strong>
                    </p>
                  </div>
                  <div style="display: flex;">
                    <span style="color: #10b981; font-size: 20px; margin-right: 10px;">3️⃣</span>
                    <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                      Once payment is confirmed, we'll finalize all arrangements for your trip
                    </p>
                  </div>
                </div>
              </div>

              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Your Tour Summary</h3>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Quotation Number:</strong> ${quotation.quotation_number}</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Tour:</strong> ${quotation.tour_name}</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Duration:</strong> ${quotation.duration_days} days</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Start Date:</strong> ${new Date(quotation.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Total Amount:</strong> ${quotation.currency} ${totalAmount}</p>
                <p style="margin: 5px 0; color: #1e40af; font-size: 14px;"><strong>Deposit Due:</strong> ${new Date(quotation.deposit_due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <table width="100%" cellpadding="10" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${quotationUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 5px;">
                      View Full Quotation
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">📞 Need Assistance?</h3>
                <p style="margin: 5px 0; color: #78350f; font-size: 14px;">WhatsApp: <a href="https://wa.me/94701888993" style="color: #10b981; text-decoration: none; font-weight: 600;">+94 70 188 8993</a></p>
                <p style="margin: 5px 0; color: #78350f; font-size: 14px;">Email: <a href="mailto:${process.env.NEXT_PUBLIC_EMAIL}" style="color: #10b981; text-decoration: none;">${process.env.NEXT_PUBLIC_EMAIL}</a></p>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                We can't wait to show you the wonders of Sri Lanka! 🇱🇰
              </p>
            </td>
          </tr>

          <!-- Review Section -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); text-align: center;">
              <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                Enjoyed Your Experience?
              </p>
              <p style="margin: 0 0 25px 0; color: #ffffff; font-size: 15px; opacity: 0.95;">
                Share your feedback and help other travelers discover Sri Lanka with us!
              </p>
              <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" style="display: inline-block; margin: 0 5px;">
                      <tr>
                        <td style="background-color: #ffffff; border-radius: 8px; padding: 12px 24px;">
                          <a href="https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html" style="color: #00af87; text-decoration: none; font-weight: 700; font-size: 14px; display: block;">
                            🦉 Review on TripAdvisor
                          </a>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" style="display: inline-block; margin: 0 5px;">
                      <tr>
                        <td style="background-color: #ffffff; border-radius: 8px; padding: 12px 24px;">
                          <a href="https://www.trustpilot.com/review/zamzamlankatours.com" style="color: #00b67a; text-decoration: none; font-weight: 700; font-size: 14px; display: block;">
                            ⭐ Review on Trustpilot
                          </a>
                        </td>
                      </tr>
                    </table>
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
                📧 ${process.env.NEXT_PUBLIC_EMAIL} | 
                📱 ${process.env.NEXT_PUBLIC_PHONE_NUMBER}
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

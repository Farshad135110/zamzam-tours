// Email service integration
// Supports multiple email providers: SendGrid, AWS SES, Resend, SMTP

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  bcc?: string | string[];
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email using configured email service
 * Configure via environment variables:
 * 
 * For SendGrid:
 * EMAIL_PROVIDER=sendgrid
 * SENDGRID_API_KEY=your_key
 * 
 * For AWS SES:
 * EMAIL_PROVIDER=ses
 * AWS_REGION=us-east-1
 * AWS_ACCESS_KEY_ID=your_key
 * AWS_SECRET_ACCESS_KEY=your_secret
 * 
 * For Resend:
 * EMAIL_PROVIDER=resend
 * RESEND_API_KEY=your_key
 * 
 * For SMTP:
 * EMAIL_PROVIDER=smtp
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your_email
 * SMTP_PASSWORD=your_password
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  const provider = process.env.EMAIL_PROVIDER || 'console';
  const fromEmail = options.from || process.env.EMAIL_FROM || 'noreply@zamzamlankatours.com';
  const replyToEmail = options.replyTo || process.env.EMAIL_REPLY_TO || fromEmail;

  try {
    switch (provider) {
      case 'sendgrid':
        return await sendWithSendGrid(options, fromEmail, replyToEmail);
      
      case 'ses':
        return await sendWithSES(options, fromEmail, replyToEmail);
      
      case 'resend':
        return await sendWithResend(options, fromEmail, replyToEmail);
      
      case 'smtp':
        return await sendWithSMTP(options, fromEmail, replyToEmail);
      
      case 'console':
      default:
        // Development mode - log to console
        console.log('\n=== EMAIL (Development Mode) ===');
        console.log('From:', fromEmail);
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('HTML Length:', options.html.length, 'characters');
        console.log('================================\n');
        
        return {
          success: true,
          messageId: `dev-${Date.now()}`
        };
    }
  } catch (error: any) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
}

// SendGrid implementation
async function sendWithSendGrid(options: EmailOptions, from: string, replyTo: string): Promise<EmailResponse> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: options.to }]
      }],
      from: { email: from },
      reply_to: { email: replyTo },
      subject: options.subject,
      content: [{
        type: 'text/html',
        value: options.html
      }]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid error: ${error}`);
  }

  const messageId = response.headers.get('X-Message-Id') || `sg-${Date.now()}`;
  
  return {
    success: true,
    messageId
  };
}

// AWS SES implementation
async function sendWithSES(options: EmailOptions, from: string, replyTo: string): Promise<EmailResponse> {
  // Note: Requires AWS SDK v3
  // Install: npm install @aws-sdk/client-ses
  
  try {
    const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
    
    const client = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: [options.to]
      },
      ReplyToAddresses: [replyTo],
      Message: {
        Subject: {
          Data: options.subject,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: options.html,
            Charset: 'UTF-8'
          }
        }
      }
    });

    const result = await client.send(command);
    
    return {
      success: true,
      messageId: result.MessageId
    };
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error('AWS SDK not installed. Run: npm install @aws-sdk/client-ses');
    }
    throw error;
  }
}

// Resend implementation
async function sendWithResend(options: EmailOptions, from: string, replyTo: string): Promise<EmailResponse> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  // Build the email payload
  const emailPayload: any = {
    from,
    to: [options.to],
    subject: options.subject,
    html: options.html
  };

  // Only add reply_to if it's a valid email
  if (replyTo && isValidEmail(replyTo)) {
    emailPayload.reply_to = [replyTo];
  }

  // Add BCC if provided
  if (options.bcc) {
    emailPayload.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  
  return {
    success: true,
    messageId: result.id
  };
}

// SMTP implementation using Nodemailer
async function sendWithSMTP(options: EmailOptions, from: string, replyTo: string): Promise<EmailResponse> {
  // Note: Requires nodemailer
  // Install: npm install nodemailer @types/nodemailer
  
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from,
      to: options.to,
      replyTo,
      subject: options.subject,
      html: options.html
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error('Nodemailer not installed. Run: npm install nodemailer @types/nodemailer');
    }
    throw error;
  }
}

// Helper function to validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to create quotation email template
export function createQuotationEmailHTML(quotation: any): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zamzamlankatours.com';
  const quotationUrl = `${siteUrl}/quotation/${quotation.quotation_number}`;
  
  // Parse numeric values (database returns them as strings)
  const basePrice = parseFloat(quotation.base_price) || 0;
  const accommodationUpgrade = parseFloat(quotation.accommodation_upgrade) || 0;
  const discountAmount = parseFloat(quotation.discount_amount) || 0;
  const discountPercentage = parseFloat(quotation.discount_percentage) || 0;
  const totalAmount = parseFloat(quotation.total_amount) || 0;
  const depositAmount = parseFloat(quotation.deposit_amount) || 0;
  const balanceAmount = parseFloat(quotation.balance_amount) || 0;
  const depositPercentage = parseFloat(quotation.deposit_percentage) || 30;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tour Quotation - ${quotation.quotation_number}</title>
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
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Your Journey Begins Here</p>
            </td>
          </tr>

          <!-- Quotation Number -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center; background-color: #f9fafb;">
              <h2 style="margin: 0 0 10px 0; color: #111827; font-size: 24px;">Your Tour Quotation is Ready!</h2>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Quotation Number: <strong style="color: #10b981;">${quotation.quotation_number}</strong></p>
            </td>
          </tr>

          <!-- Customer Details -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="margin: 0 0 15px 0; color: #374151;">Dear <strong>${quotation.customer_name}</strong>,</p>
              <p style="margin: 0 0 20px 0; color: #374151; line-height: 1.6;">
                Thank you for your interest in exploring Sri Lanka with us! We've prepared a personalized quotation for your upcoming tour.
              </p>
            </td>
          </tr>

          <!-- Tour Summary -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px;">
                <tr>
                  <td colspan="2" style="padding: 15px; border-bottom: 2px solid #10b981;">
                    <h3 style="margin: 0; color: #111827; font-size: 18px;">${quotation.tour_name}</h3>
                  </td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 10px 15px;"><strong>Duration:</strong></td>
                  <td style="color: #111827; padding: 10px 15px;">${quotation.duration_days} Days / ${quotation.duration_days - 1} Nights</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="color: #6b7280; padding: 10px 15px;"><strong>Passengers:</strong></td>
                  <td style="color: #111827; padding: 10px 15px;">
                    ${quotation.num_adults} Adult${quotation.num_adults > 1 ? 's' : ''}
                    ${quotation.num_children > 0 ? ` + ${quotation.num_children} Child${quotation.num_children > 1 ? 'ren' : ''}` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding: 10px 15px;"><strong>Travel Dates:</strong></td>
                  <td style="color: #111827; padding: 10px 15px;">
                    ${new Date(quotation.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    to
                    ${new Date(quotation.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pricing -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; padding: 8px 0;">Tour Package</td>
                  <td align="right" style="color: #111827; font-weight: 600; padding: 8px 0;">${quotation.currency} ${basePrice.toFixed(2)}</td>
                </tr>
                ${accommodationUpgrade > 0 ? `
                <tr>
                  <td style="color: #6b7280; padding: 8px 0;">Accommodation Upgrade</td>
                  <td align="right" style="color: #111827; font-weight: 600; padding: 8px 0;">${quotation.currency} ${accommodationUpgrade.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${discountAmount > 0 ? `
                <tr>
                  <td style="color: #10b981; padding: 8px 0;">Discount (${discountPercentage}%)</td>
                  <td align="right" style="color: #10b981; font-weight: 600; padding: 8px 0;">- ${quotation.currency} ${discountAmount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="color: #111827; font-size: 18px; font-weight: bold; padding: 15px 0 8px 0;">TOTAL</td>
                  <td align="right" style="color: #10b981; font-size: 24px; font-weight: bold; padding: 15px 0 8px 0;">${quotation.currency} ${totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Terms -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fffbeb; border-left: 4px solid #f59e0b;">
              <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 600;">Payment Terms:</p>
              <p style="margin: 0 0 5px 0; color: #78350f;">
                <strong>Deposit (${depositPercentage}%):</strong> ${quotation.currency} ${depositAmount.toFixed(2)}
              </p>
              <p style="margin: 0; color: #78350f;">
                <strong>Balance:</strong> ${quotation.currency} ${balanceAmount.toFixed(2)} (due 14 days before tour)
              </p>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <table width="100%" cellpadding="10" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${quotationUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 5px;">
                      View Full Quotation
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

          <!-- Validity Notice -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fef3c7; text-align: center;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                ⏰ This quotation is valid until <strong>${new Date(quotation.valid_until).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
              </p>
            </td>
          </tr>

          <!-- Review Request -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); text-align: center; border-top: 3px solid #047857;">
              <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                Enjoyed Your Experience?
              </p>
              <p style="margin: 0 0 25px 0; color: #ffffff; font-size: 15px; opacity: 0.95;">
                Share your feedback and help other travelers discover Sri Lanka with us!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px;">
                    <a href="https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html" style="display: inline-block; text-decoration: none; margin: 0 10px;">
                      <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="Review us on TripAdvisor" width="180" height="36" style="border: 0; display: block; background-color: #ffffff; padding: 8px 16px; border-radius: 8px;">
                    </a>
                    <a href="https://www.trustpilot.com/review/zamzamlankatours.com" style="display: inline-block; text-decoration: none; margin: 0 10px;">
                      <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" alt="Review us on Trustpilot" width="140" height="36" style="border: 0; display: block; background-color: #ffffff; padding: 8px 16px; border-radius: 8px;">
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

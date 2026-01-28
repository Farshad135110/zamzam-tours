// Post-tour review request email template
export function createPostTourReviewEmail(tourData: {
  customerName: string;
  tourName: string;
  completionDate: string;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zamzamlankatours.com';
  const tripadvisorUrl = 'https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html';
  const googleReviewUrl = 'https://g.page/r/CQZmXOgmix1OEAE/review';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Traveling with Us!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <img src="https://res.cloudinary.com/dhqhxma30/image/upload/v1769571998/zamzamlankatourslogonewcropped_knodzl.png" alt="ZamZam Lanka Tours" style="height: 60px; margin-bottom: 15px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Thank You!</h1>
              <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">We hope you had an amazing experience</p>
            </td>
          </tr>

          <!-- Personalized Message -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                Dear <strong>${tourData.customerName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                Thank you for choosing ZamZam Lanka Tours for your <strong>${tourData.tourName}</strong>! 
                We hope you created unforgettable memories during your time in beautiful Sri Lanka.
              </p>
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                Your feedback is incredibly valuable to us and helps other travelers discover the magic of Sri Lanka. 
                Would you take just 2 minutes to share your experience?
              </p>
            </td>
          </tr>

          <!-- Review Buttons -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 30px; text-align: center; border: 2px solid #10b981;">
                <h2 style="margin: 0 0 20px 0; color: #065f46; font-size: 22px; font-weight: bold;">
                  Share Your Experience
                </h2>
                <p style="margin: 0 0 25px 0; color: #047857; font-size: 14px;">
                  Choose your preferred platform:
                </p>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <a href="${tripadvisorUrl}" style="display: inline-block; text-decoration: none; margin: 0 10px;">
                        <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="Review us on TripAdvisor" width="180" height="36" style="border: 0; display: block; background-color: #ffffff; padding: 8px 16px; border-radius: 8px;">
                      </a>
                      <a href="https://www.trustpilot.com/review/zamzamlankatours.com" style="display: inline-block; text-decoration: none; margin: 0 10px;">
                        <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" alt="Review us on Trustpilot" width="140" height="36" style="border: 0; display: block; background-color: #ffffff; padding: 8px 16px; border-radius: 8px;">
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="${siteUrl}/contact" style="display: inline-block; background-color: #6b7280; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                        💬 Send Private Feedback
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Why Reviews Matter -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 6px;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-weight: 600; font-size: 14px;">
                  🙏 Why Your Review Matters
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; line-height: 1.6;">
                  <li>Helps other travelers plan their dream vacation</li>
                  <li>Supports our local team and Sri Lankan tourism</li>
                  <li>Takes just 2 minutes of your time</li>
                  <li>Makes a huge difference to our small business</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Stay Connected -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Stay Connected</h3>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                Follow us for travel tips and special offers
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://facebook.com/zamzamlankatours" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background-color: #1877f2; color: white; width: 36px; height: 36px; line-height: 36px; border-radius: 50%; font-size: 18px;">f</span>
                    </a>
                    <a href="https://instagram.com/zamzamlankatours" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: white; width: 36px; height: 36px; line-height: 36px; border-radius: 50%; font-size: 18px;">📷</span>
                    </a>
                    <a href="https://www.tiktok.com/@zam.zam.tours.ren?_r=1&_t=ZS-933rgtHM6Me" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background-color: #000000; color: white; width: 36px; height: 36px; line-height: 36px; border-radius: 50%; font-size: 18px;">🎵</span>
                    </a>
                    <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')}" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background-color: #25d366; color: white; width: 36px; height: 36px; line-height: 36px; border-radius: 50%; font-size: 18px;">💬</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Planning Another Trip -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 25px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px;">Planning Another Adventure?</h3>
                <p style="margin: 0 0 20px 0; color: #78350f; font-size: 14px;">
                  Get 10% off your next booking as a returning customer!
                </p>
                <a href="${siteUrl}/tours" style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  Explore Our Tours
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #111827; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: 600;">ZamZam Lanka Tours</p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">Your Trusted Travel Partner in Sri Lanka</p>
              <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 13px;">
                📧 ${process.env.NEXT_PUBLIC_EMAIL}
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 13px;">
                📱 ${process.env.NEXT_PUBLIC_PHONE_NUMBER}
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Tour completed on ${new Date(tourData.completionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

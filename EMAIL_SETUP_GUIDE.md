# Email Service Configuration Guide

## Overview
The quotation system now uses a flexible email service that supports multiple providers:
- **SendGrid** (recommended for production)
- **AWS SES** (cost-effective for high volume)
- **Resend** (modern, developer-friendly)
- **SMTP** (works with Gmail, Outlook, etc.)
- **Console** (development mode - logs emails)

## Quick Setup

### Option 1: SendGrid (Recommended)

1. **Create SendGrid account:** https://sendgrid.com/
2. **Get API key:** Settings → API Keys → Create API Key
3. **Add to `.env.local`:**
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@zamzamlankatours.com
EMAIL_REPLY_TO=info@zamzamlankatours.com
```

4. **Verify sender email** in SendGrid dashboard

**Free tier:** 100 emails/day forever

### Option 2: Resend (Modern Alternative)

1. **Create account:** https://resend.com/
2. **Get API key:** API Keys → Create
3. **Add to `.env.local`:**
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@zamzamlankatours.com
EMAIL_REPLY_TO=info@zamzamlankatours.com
```

**Free tier:** 100 emails/day

### Option 3: Gmail SMTP (Easy for Testing)

1. **Enable 2-Step Verification** in your Google account
2. **Generate App Password:**
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Add to `.env.local`:**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_REPLY_TO=your-email@gmail.com
```

4. **Install nodemailer:**
```bash
npm install nodemailer @types/nodemailer
```

**Limit:** 500 emails/day for free Gmail accounts

### Option 4: AWS SES (High Volume)

1. **Create AWS account:** https://aws.amazon.com/
2. **Get credentials:**
   - IAM → Create user → Attach `AmazonSESFullAccess`
   - Create access key

3. **Add to `.env.local`:**
```env
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@zamzamlankatours.com
EMAIL_REPLY_TO=info@zamzamlankatours.com
```

4. **Verify email** in SES console
5. **Request production access** (starts in sandbox mode)
6. **Install AWS SDK:**
```bash
npm install @aws-sdk/client-ses
```

**Cost:** $0.10 per 1,000 emails (very cheap for high volume)

## Development Mode

By default, emails are logged to console during development:

```env
# Or just don't set EMAIL_PROVIDER
EMAIL_PROVIDER=console
```

This is perfect for testing without sending real emails.

## Environment Variables Reference

```env
# Required for all providers
EMAIL_PROVIDER=sendgrid|ses|resend|smtp|console
EMAIL_FROM=noreply@zamzamlankatours.com
EMAIL_REPLY_TO=info@zamzamlankatours.com

# Site configuration
NEXT_PUBLIC_SITE_URL=https://zamzamlankatours.com
NEXT_PUBLIC_EMAIL=info@zamzamlankatours.com
NEXT_PUBLIC_PHONE_NUMBER=+94 77 123 4567
NEXT_PUBLIC_WHATSAPP_NUMBER=+94771234567

# SendGrid specific
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx

# AWS SES specific
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx

# Resend specific
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# SMTP specific
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Testing

### 1. Test Email Service

Create `scripts/test-email.js`:

```javascript
const { sendEmail } = require('../lib/emailService');

sendEmail({
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<h1>Test</h1><p>If you receive this, email is working!</p>'
}).then(result => {
  console.log('Result:', result);
});
```

Run:
```bash
node scripts/test-email.js
```

### 2. Test Quotation Email

```bash
# Create a test quotation via admin panel
# Then send it to your own email
```

## Switching Providers

Just change the `EMAIL_PROVIDER` environment variable and add the required credentials. No code changes needed!

## Troubleshooting

### SendGrid: "Sender not verified"
- Verify your sender email in SendGrid dashboard
- Or use SendGrid's sandbox mode for testing

### Gmail SMTP: "Username and Password not accepted"
- Make sure 2-Step Verification is enabled
- Use App Password, not regular password
- Check "Less secure app access" (if not using 2-Step)

### AWS SES: "Email address not verified"
- Verify sender email in SES console
- If in sandbox mode, verify recipient emails too
- Request production access for unlimited recipients

### Resend: "Domain not verified"
- Add and verify your domain in Resend dashboard
- Or use `@resend.dev` domain for testing

## Production Checklist

- [ ] Choose email provider (SendGrid recommended)
- [ ] Set up account and get API credentials
- [ ] Add environment variables to hosting platform
- [ ] Verify sender email/domain
- [ ] Test sending to your own email
- [ ] Test quotation workflow end-to-end
- [ ] Monitor email delivery rates
- [ ] Set up email analytics (optional)

## Monitoring

Check email delivery in provider dashboards:
- **SendGrid:** Activity → Email Activity
- **AWS SES:** Reputation Dashboard
- **Resend:** Emails → Recent sends
- **SMTP:** Check email provider logs

## Cost Comparison

| Provider | Free Tier | Paid Pricing |
|----------|-----------|--------------|
| **SendGrid** | 100/day | $14.95/month (40K emails) |
| **Resend** | 100/day | $20/month (50K emails) |
| **AWS SES** | 62K/month (via EC2) | $0.10/1000 emails |
| **Gmail SMTP** | 500/day | Not for commercial use |

## Recommended Setup

**For small agencies (< 100 emails/day):**
- Use SendGrid or Resend free tier
- Simple setup, reliable delivery
- Good email analytics

**For growing agencies (100-1000 emails/day):**
- SendGrid paid plan ($14.95/month)
- Or AWS SES ($0.10/1000 = $10/month for 100K emails)

**For large volume (1000+ emails/day):**
- AWS SES (most cost-effective)
- Set up proper bounce/complaint handling

## Need Help?

Email service integration complete! Choose your provider and update `.env.local` to start sending quotations.

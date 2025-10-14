# Contact Form Setup Guide

## Overview

The contact form is now live at `/contact` and sends emails to `hess.rylan@gmail.com` using Resend.

## Setup Required

### 1. Install Resend Package

```bash
cd /Users/rylanhess/Documents/Github/den-bmx
npm install resend
```

### 2. Get Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free tier is fine)
2. Verify your email
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

### 3. Add Environment Variable

Add to your `.env.local` file (create it if it doesn't exist):

```bash
RESEND_API_KEY=re_your_api_key_here
```

**Important**: Never commit your `.env.local` file to Git!

### 4. Test the Form

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000/contact`
3. Fill out and submit the form
4. Check your email at hess.rylan@gmail.com

## Features

### Contact Page (`/contact`)
- ✅ Wild BMX-themed design matching the site
- ✅ Logo and family photo displayed
- ✅ Form with name, email, and message fields
- ✅ Animated "CONTACT ME" button on homepage
- ✅ Form validation
- ✅ Success/error states
- ✅ Loading animation while sending
- ✅ Back button to home

### Email Features
- ✅ Sends to hess.rylan@gmail.com
- ✅ Reply-to set to sender's email
- ✅ Styled HTML email with BMX theme
- ✅ Includes sender's name and email
- ✅ Full message text

## Customization

### Change Recipient Email

Edit `src/app/api/contact/route.ts`:

```typescript
to: ['your-new-email@example.com'],
```

### Customize Email Template

Edit the HTML in `src/app/api/contact/route.ts` in the `html` field.

### Change From Address (Optional)

Once you verify a domain in Resend, you can use a custom from address:

```typescript
from: 'DEN BMX <contact@yourdomain.com>',
```

## Production Deployment

### Vercel

1. Add environment variable in Vercel dashboard:
   - Go to your project settings
   - Environment Variables
   - Add `RESEND_API_KEY` with your API key
   - Deploy

### Other Platforms

Add the `RESEND_API_KEY` environment variable in your platform's dashboard.

## Alternative: Use Your Own SMTP

If you prefer not to use Resend, you can use Nodemailer with Gmail:

1. Install: `npm install nodemailer`
2. Enable 2FA on your Gmail account
3. Generate an "App Password"
4. Replace the Resend code with Nodemailer

Example with Gmail:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hess.rylan@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Your Gmail app password
  }
});

await transporter.sendMail({
  from: 'hess.rylan@gmail.com',
  to: 'hess.rylan@gmail.com',
  replyTo: body.email,
  subject: `New Contact from ${body.name}`,
  html: '...'
});
```

## Troubleshooting

### "Email service not configured" error
- Check that `RESEND_API_KEY` is set in `.env.local`
- Restart your dev server after adding the env variable

### Emails not arriving
- Check spam/junk folder
- Verify the API key is correct
- Check Resend dashboard for logs
- Make sure you're on a paid plan if you've exceeded free tier limits

### Form not submitting
- Check browser console for errors
- Verify the API route is working: `http://localhost:3000/api/contact`
- Check server logs

## Free Tier Limits

Resend free tier includes:
- 100 emails per day
- 3,000 emails per month

This should be plenty for a contact form!

## Need Help?

If the form isn't working, users can always email you directly at:
**hess.rylan@gmail.com** (shown on the contact page)


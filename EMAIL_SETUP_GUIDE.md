# 📧 Email Setup Guide for Contact Form

Your contact form is ready to receive messages! Follow these steps to connect it to your email.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. Go to **"Email Services"** in the dashboard
2. Click **"Add New Service"**
3. Choose **Gmail** (or your preferred email provider)
4. Click **"Connect Account"** and authorize access
5. **COPY YOUR SERVICE ID** (example: `service_abc1234`)

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Set up your template:

**Template Settings:**
- **Template Name**: Portfolio Contact Form
- **To Email**: YOUR_EMAIL@gmail.com (where you want to receive messages)
- **From Name**: {{from_name}}
- **From Email**: {{from_email}}
- **Reply To**: {{from_email}}

**Email Content (use this exact format):**
```
Subject: 🚀 New Portfolio Message from {{from_name}}

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

────────────────────────────
Sent from your portfolio contact form
```

4. **Important**: Make sure these variable names match:
   - `from_name` (visitor's name)
   - `from_email` (visitor's email)
   - `message` (visitor's message)

5. Click **"Save"**
6. **COPY YOUR TEMPLATE ID** (example: `template_xyz5678`)

### Step 4: Get Your Public Key
1. Click on your profile/account icon
2. Go to **"Account"** → **"General"**
3. Find **"Public Key"** (also called API Key)
4. **COPY YOUR PUBLIC KEY** (example: `abcdefghijklmnop`)

### Step 5: Configure Your Project
1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual IDs:

```env
VITE_APP_EMAILJS_SERVICE_ID=service_abc1234
VITE_APP_EMAILJS_TEMPLATE_ID=template_xyz5678
VITE_APP_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

### Step 6: Restart Your Server
1. Stop your development server (Ctrl + C in terminal)
2. Run `npm run dev` again
3. Your contact form is now connected! 🎉

## 🧪 Testing Your Contact Form

1. Open your portfolio at `http://localhost:5173/`
2. Scroll to the contact section
3. Fill out the form with test data:
   - Name: Test User
   - Email: test@example.com
   - Message: This is a test message
4. Click **"Send Message"**
5. Check your email inbox - you should receive the message!

## ❗ Important Notes

- **Free tier**: 200 emails/month (more than enough for a portfolio)
- **Security**: Never commit your `.env` file to GitHub (it's already in .gitignore)
- **Email delivery**: Messages arrive instantly (check spam if you don't see it)
- **Multiple emails**: You can add multiple recipient emails in EmailJS template settings

## 🐛 Troubleshooting

### "Email service not configured" error
- Make sure all three values are set in `.env` file
- Restart your development server after adding the values

### Messages not arriving
- Check your spam/junk folder
- Verify the "To Email" in your EmailJS template is correct
- Check EmailJS dashboard for error logs

### "Invalid public key" error
- Make sure you copied the Public Key correctly (no extra spaces)
- Public key should start with a letter and contain no dashes

### Form shows success but no email received
- Log in to EmailJS dashboard
- Go to "History" to see sent emails and any errors
- Verify your email service is still connected

## 📊 Monitor Your Messages

Visit EmailJS dashboard to:
- See all sent messages in **"History"**
- Check your monthly quota usage
- View error logs if something goes wrong
- Update your email template anytime

## 🎨 Customization

You can customize the email template in EmailJS dashboard:
- Change the subject line
- Add HTML styling
- Include additional fields
- Set up auto-reply messages

---

## ✅ Checklist

- [ ] Created EmailJS account
- [ ] Added email service (Gmail/Outlook/etc)
- [ ] Created email template with correct variables
- [ ] Got Service ID, Template ID, and Public Key
- [ ] Updated `.env` file with all three values
- [ ] Restarted development server
- [ ] Tested contact form
- [ ] Received test email

**Need help?** Visit [EmailJS Documentation](https://www.emailjs.com/docs/)

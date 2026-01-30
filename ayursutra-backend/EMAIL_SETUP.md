# 📧 Email Setup Guide for AyurSutra Backend

## ✅ Email Functionality Added!

Your AyurSutra backend now has complete email functionality! Here's what's been added:

### 🚀 **New Email Features:**

1. **Welcome Emails** - Sent to new practitioners upon registration
2. **Appointment Reminders** - Sent to patients before their appointments
3. **Therapy Completion Notifications** - Sent after therapy sessions
4. **Password Reset Emails** - For account recovery
5. **Test Emails** - To verify email functionality

### 📁 **New Files Created:**

- `services/emailService.js` - Email service with templates
- `routes/email.js` - Email API endpoints
- `EMAIL_SETUP.md` - This setup guide

### 🔧 **New API Endpoints:**

- `POST /api/email/test` - Send test email
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/appointment-reminder` - Send appointment reminder
- `POST /api/email/therapy-completion` - Send therapy completion notification
- `POST /api/email/password-reset` - Send password reset email

## ⚙️ **Setup Instructions:**

### **Step 1: Configure Gmail (Recommended for Development)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### **Step 2: Update Environment Variables**

Edit your `.env` file in the `ayursutra-backend` directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=AyurSutra <noreply@ayursutra.com>
```

### **Step 3: Restart the Backend**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
node app.js
```

## 🧪 **Testing Email Functionality:**

### **Test Email API:**

```bash
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com"}'
```

### **Send Welcome Email:**

```bash
curl -X POST http://localhost:5000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"practitionerId": "PRACTITIONER_ID_HERE"}'
```

## 📧 **Email Templates Included:**

### **1. Welcome Email**
- Professional welcome message
- Account details
- Getting started information

### **2. Appointment Reminder**
- Appointment details
- Date and time
- Reminder to arrive early

### **3. Therapy Completion**
- Session completion confirmation
- Post-therapy instructions
- Follow-up information

### **4. Password Reset**
- Secure reset link
- 1-hour expiration
- Security instructions

## 🔒 **Security Features:**

- ✅ Secure password reset tokens
- ✅ Token expiration (1 hour)
- ✅ No email enumeration (security)
- ✅ Professional email templates
- ✅ Error handling and logging

## 🚀 **Production Recommendations:**

For production, consider using:

1. **SendGrid** - Professional email service
2. **AWS SES** - Amazon's email service
3. **Mailgun** - Developer-friendly email API
4. **Postmark** - Transactional email service

### **Example SendGrid Configuration:**

```javascript
// In services/emailService.js
this.transporter = nodemailer.createTransporter({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

## 📱 **Frontend Integration:**

The email functionality is ready to be integrated with your frontend:

```javascript
// Example frontend usage
const sendTestEmail = async (email) => {
  const response = await fetch('http://localhost:5000/api/email/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to: email })
  });
  return response.json();
};
```

## 🎯 **Next Steps:**

1. ✅ Configure your Gmail credentials
2. ✅ Test the email functionality
3. ✅ Integrate with your frontend
4. ✅ Set up production email service (optional)

## 📞 **Support:**

If you encounter any issues:

1. Check your Gmail app password
2. Verify environment variables
3. Check server logs for errors
4. Test with the provided API endpoints

---

**Your AyurSutra backend now has complete email functionality! 🎉**

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // For development, we'll use Gmail SMTP
    // In production, you should use a proper email service like SendGrid, AWS SES, etc.
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // Your Gmail app password
      }
    });
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Welcome email for new practitioners
  async sendWelcomeEmail(practitioner) {
    const subject = 'Welcome to AyurSutra - Panchakarma Management System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5530;">Welcome to AyurSutra!</h2>
        <p>Dear ${practitioner.name},</p>
        <p>Welcome to AyurSutra, your comprehensive Panchakarma management system!</p>
        <p>Your account has been successfully created with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${practitioner.name}</li>
          <li><strong>Email:</strong> ${practitioner.email}</li>
          <li><strong>Clinic:</strong> ${practitioner.clinicName || 'Not specified'}</li>
        </ul>
        <p>You can now start managing your patients and therapy schedules efficiently.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <br>
        <p>Best regards,<br>The AyurSutra Team</p>
      </div>
    `;

    return await this.sendEmail(practitioner.email, subject, html);
  }

  // Appointment reminder email
  async sendAppointmentReminder(patient, appointment) {
    const subject = 'Appointment Reminder - AyurSutra';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5530;">Appointment Reminder</h2>
        <p>Dear ${patient.name},</p>
        <p>This is a reminder about your upcoming appointment:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Appointment Details</h3>
          <p><strong>Therapy:</strong> ${appointment.therapyName}</p>
          <p><strong>Date:</strong> ${new Date(appointment.scheduledDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.scheduledTime || 'To be confirmed'}</p>
          <p><strong>Status:</strong> ${appointment.status}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        <br>
        <p>Best regards,<br>Your AyurSutra Team</p>
      </div>
    `;

    return await this.sendEmail(patient.email, subject, html);
  }

  // Therapy completion notification
  async sendTherapyCompletionNotification(patient, therapy) {
    const subject = 'Therapy Session Completed - AyurSutra';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5530;">Therapy Session Completed</h2>
        <p>Dear ${patient.name},</p>
        <p>Your therapy session has been completed successfully!</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Session Details</h3>
          <p><strong>Therapy:</strong> ${therapy.therapyName}</p>
          <p><strong>Date:</strong> ${new Date(therapy.scheduledDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${therapy.status}</p>
        </div>
        <p>We hope you had a beneficial session. Please follow any post-therapy instructions provided by your practitioner.</p>
        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>Your AyurSutra Team</p>
      </div>
    `;

    return await this.sendEmail(patient.email, subject, html);
  }

  // Password reset email
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request - AyurSutra';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5530;">Password Reset Request</h2>
        <p>You have requested to reset your password for your AyurSutra account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>The AyurSutra Team</p>
      </div>
    `;

    return await this.sendEmail(email, subject, html);
  }

  // Test email functionality
  async sendTestEmail(to) {
    const subject = 'Test Email - AyurSutra Backend';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5530;">Test Email</h2>
        <p>This is a test email from your AyurSutra backend system.</p>
        <p>If you're receiving this email, the email functionality is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <br>
        <p>Best regards,<br>The AyurSutra Team</p>
      </div>
    `;

    return await this.sendEmail(to, subject, html);
  }
}

module.exports = new EmailService();

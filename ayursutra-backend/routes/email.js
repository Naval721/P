const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const { getDatabase } = require('../db/connect');

// POST /api/email/test - Send test email
router.post('/test', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Email address is required'
      });
    }

    const result = await emailService.sendTestEmail(to);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Email sending failed',
        message: result.error
      });
    }

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send test email'
    });
  }
});

// POST /api/email/welcome - Send welcome email to practitioner
router.post('/welcome', async (req, res) => {
  try {
    const { practitionerId } = req.body;

    if (!practitionerId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Practitioner ID is required'
      });
    }

    const db = getDatabase();
    const practitioner = await db.collection('practitioners').findOne({ _id: practitionerId });

    if (!practitioner) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Practitioner not found'
      });
    }

    const result = await emailService.sendWelcomeEmail(practitioner);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Email sending failed',
        message: result.error
      });
    }

  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send welcome email'
    });
  }
});

// POST /api/email/appointment-reminder - Send appointment reminder
router.post('/appointment-reminder', async (req, res) => {
  try {
    const { patientId, appointmentId } = req.body;

    if (!patientId || !appointmentId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Patient ID and appointment ID are required'
      });
    }

    const db = getDatabase();
    
    // Get patient details
    const patient = await db.collection('patients').findOne({ _id: patientId });
    if (!patient) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Patient not found'
      });
    }

    // Get appointment details
    const appointment = await db.collection('therapySchedules').findOne({ _id: appointmentId });
    if (!appointment) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Appointment not found'
      });
    }

    const result = await emailService.sendAppointmentReminder(patient, appointment);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Appointment reminder sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Email sending failed',
        message: result.error
      });
    }

  } catch (error) {
    console.error('Appointment reminder error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send appointment reminder'
    });
  }
});

// POST /api/email/therapy-completion - Send therapy completion notification
router.post('/therapy-completion', async (req, res) => {
  try {
    const { patientId, therapyId } = req.body;

    if (!patientId || !therapyId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Patient ID and therapy ID are required'
      });
    }

    const db = getDatabase();
    
    // Get patient details
    const patient = await db.collection('patients').findOne({ _id: patientId });
    if (!patient) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Patient not found'
      });
    }

    // Get therapy details
    const therapy = await db.collection('therapySchedules').findOne({ _id: therapyId });
    if (!therapy) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Therapy not found'
      });
    }

    const result = await emailService.sendTherapyCompletionNotification(patient, therapy);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Therapy completion notification sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Email sending failed',
        message: result.error
      });
    }

  } catch (error) {
    console.error('Therapy completion email error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send therapy completion notification'
    });
  }
});

// POST /api/email/password-reset - Send password reset email
router.post('/password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Email address is required'
      });
    }

    const db = getDatabase();
    const practitioner = await db.collection('practitioners').findOne({ email });

    if (!practitioner) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (in a real app, you'd store this in database with expiration)
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    
    // Store reset token in database (you should add expiration time)
    await db.collection('practitioners').updateOne(
      { _id: practitioner._id },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
        }
      }
    );

    const result = await emailService.sendPasswordResetEmail(email, resetToken);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Email sending failed',
        message: result.error
      });
    }

  } catch (error) {
    console.error('Password reset email error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send password reset email'
    });
  }
});

module.exports = router;

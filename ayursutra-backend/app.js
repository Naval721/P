const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./db/connect');

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const therapyRoutes = require('./routes/therapy');
const emailRoutes = require('./routes/email');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Content-Type: ${req.get('Content-Type')}`);
  next();
});

// JSON parsing middleware with error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      const rawBody = buf.toString();
      console.log('Raw request body:', rawBody);
      console.log('Request URL:', req.url);
      console.log('Request method:', req.method);
      JSON.parse(rawBody);
    } catch (e) {
      console.error('Invalid JSON received:', buf.toString());
      console.error('JSON parse error:', e.message);
      res.status(400).json({ 
        error: 'Invalid JSON format',
        message: 'The request body contains invalid JSON'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AyurSutra Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API base endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'AyurSutra API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/practitioner',
      patients: '/api/patients',
      therapies: '/api/therapy',
      email: '/api/email'
    },
    documentation: {
      auth: {
        'POST /api/practitioner/register': 'Register a new practitioner',
        'POST /api/practitioner/login': 'Login practitioner',
        'GET /api/practitioner/profile': 'Get practitioner profile (protected)'
      },
      patients: {
        'GET /api/patients/:practitionerId': 'Get all patients for a practitioner',
        'GET /api/patients/single/:id': 'Get a specific patient',
        'POST /api/patients': 'Create a new patient',
        'PUT /api/patients/:id': 'Update a patient',
        'DELETE /api/patients/:id': 'Delete a patient',
        'GET /api/patients/search/:practitionerId': 'Search patients'
      },
      therapies: {
        'POST /api/therapy': 'Create a therapy schedule',
        'GET /api/therapy/practitioner/:practitionerId': 'Get schedules for practitioner',
        'GET /api/therapy/patient/:patientId': 'Get schedules for patient',
        'GET /api/therapy/:id': 'Get specific therapy schedule',
        'PUT /api/therapy/:id': 'Update therapy schedule',
        'POST /api/therapy/feedback/:id': 'Add feedback to therapy',
        'DELETE /api/therapy/:id': 'Delete therapy schedule',
        'GET /api/therapy/stats/:practitionerId': 'Get therapy statistics'
      },
      email: {
        'POST /api/email/test': 'Send test email',
        'POST /api/email/welcome': 'Send welcome email to practitioner',
        'POST /api/email/appointment-reminder': 'Send appointment reminder',
        'POST /api/email/therapy-completion': 'Send therapy completion notification',
        'POST /api/email/password-reset': 'Send password reset email'
      }
    }
  });
});

// API routes
app.use('/api', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/therapy', therapyRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'The request body contains invalid JSON format'
    });
  }
  
  // Handle other errors
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      health: 'GET /health',
      api: 'GET /api',
      auth: 'POST /api/practitioner/register, POST /api/practitioner/login',
      patients: 'GET /api/patients/:practitionerId, POST /api/patients',
      therapies: 'POST /api/therapy, GET /api/therapy/practitioner/:practitionerId'
    }
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 AyurSutra Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

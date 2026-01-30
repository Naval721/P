const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../db/connect');

// POST /api/practitioner/register - Register a new practitioner
router.post('/practitioner/register', async (req, res) => {
  try {
    const { name, email, password, clinicName } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Name, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Password must be at least 6 characters long' 
      });
    }

    const db = getDatabase();
    const practitionersCollection = db.collection('practitioners');

    // Check if practitioner already exists
    const existingPractitioner = await practitionersCollection.findOne({ email });
    if (existingPractitioner) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'Practitioner with this email already exists' 
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new practitioner
    const newPractitioner = {
      name,
      email,
      password: hashedPassword,
      clinicName: clinicName || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await practitionersCollection.insertOne(newPractitioner);
    
    // Create JWT token
    const token = jwt.sign(
      { practitionerId: result.insertedId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return practitioner data without password
    const { password: _, ...practitionerData } = newPractitioner;
    practitionerData._id = result.insertedId;

    res.status(201).json({
      success: true,
      message: 'Practitioner registered successfully',
      practitioner: practitionerData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to register practitioner' 
    });
  }
});

// POST /api/practitioner/login - Login practitioner
router.post('/practitioner/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Email and password are required' 
      });
    }

    const db = getDatabase();
    const practitionersCollection = db.collection('practitioners');

    // Find practitioner by email
    const practitioner = await practitionersCollection.findOne({ email });
    if (!practitioner) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, practitioner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { practitionerId: practitioner._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return practitioner data without password
    const { password: _, ...practitionerData } = practitioner;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      practitioner: practitionerData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to login practitioner' 
    });
  }
});

// GET /api/practitioner/profile - Get practitioner profile (protected route)
router.get('/practitioner/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDatabase();
    const practitionersCollection = db.collection('practitioners');

    const practitioner = await practitionersCollection.findOne({ _id: decoded.practitionerId });
    if (!practitioner) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Practitioner not found' 
      });
    }

    const { password: _, ...practitionerData } = practitioner;

    res.status(200).json({
      success: true,
      practitioner: practitionerData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token is invalid or expired' 
      });
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch profile' 
    });
  }
});

module.exports = router;

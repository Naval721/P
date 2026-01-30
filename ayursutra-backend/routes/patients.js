const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

// GET /api/patients/:practitionerId - Get all patients for a specific practitioner
router.get('/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    
    if (!practitionerId) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Practitioner ID is required' 
      });
    }

    const db = getDatabase();
    const patients = await db.collection('patients')
      .find({ practitionerId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.status(200).json({
      success: true,
      patients,
      count: patients.length
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch patients' 
    });
  }
});

// GET /api/patients/single/:id - Get a specific patient by ID
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Patient ID is required' 
      });
    }

    const db = getDatabase();
    const patient = await db.collection('patients').findOne({ _id: new ObjectId(id) });
    
    if (!patient) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch patient' 
    });
  }
});

// POST /api/patients - Create a new patient
router.post('/', async (req, res) => {
  try {
    const { practitionerId, name, email, phone, primaryDosha, healthNotes } = req.body;
    
    // Validation
    if (!practitionerId || !name) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Practitioner ID and name are required' 
      });
    }

    const db = getDatabase();
    const newPatient = {
      practitionerId,
      name,
      email: email || '',
      phone: phone || '',
      primaryDosha: primaryDosha || '',
      healthNotes: healthNotes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('patients').insertOne(newPatient);
    newPatient._id = result.insertedId;

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient: newPatient
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create patient' 
    });
  }
});

// PUT /api/patients/:id - Update a patient's details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, primaryDosha, healthNotes } = req.body;
    
    // Validation
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Patient ID is required' 
      });
    }

    if (!name) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Name is required' 
      });
    }

    const db = getDatabase();
    const updateData = {
      name,
      email: email || '',
      phone: phone || '',
      primaryDosha: primaryDosha || '',
      healthNotes: healthNotes || '',
      updatedAt: new Date()
    };

    const result = await db.collection('patients').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update patient' 
    });
  }
});

// DELETE /api/patients/:id - Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Patient ID is required' 
      });
    }

    const db = getDatabase();
    
    const result = await db.collection('patients').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Patient not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete patient' 
    });
  }
});

// GET /api/patients/search/:practitionerId - Search patients by name or email
router.get('/search/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const { q } = req.query;
    
    if (!practitionerId) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Practitioner ID is required' 
      });
    }

    if (!q) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Search query is required' 
      });
    }

    const db = getDatabase();
    const patients = await db.collection('patients')
      .find({
        practitionerId,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      patients,
      count: patients.length
    });
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to search patients' 
    });
  }
});

module.exports = router;

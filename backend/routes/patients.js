const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

// GET /api/patients/:practitionerId - Get all patients for a specific practitioner
router.get('/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const db = getDatabase();
    const patients = await db.collection('patients').find({ practitionerId }).toArray();
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients - Create a new patient
router.post('/', async (req, res) => {
  try {
    const { practitionerId, name, email, phone, primaryDosha, healthNotes } = req.body;
    
    if (!practitionerId || !name) {
      return res.status(400).json({ error: 'Practitioner ID and name are required' });
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
      message: 'Patient created successfully',
      patient: newPatient
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/patients/:id - Update a patient's details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, primaryDosha, healthNotes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
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
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient updated successfully',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/patients/:id - Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = await db.collection('patients').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

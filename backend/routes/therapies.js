const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

// POST /api/therapy-schedule - Create a new therapy schedule
router.post('/therapy-schedule', async (req, res) => {
  try {
    const { patientId, practitionerId, therapyName, scheduledDate, scheduledTime, status, precautions } = req.body;
    
    if (!patientId || !practitionerId || !therapyName || !scheduledDate) {
      return res.status(400).json({ error: 'Patient ID, practitioner ID, therapy name, and scheduled date are required' });
    }

    const db = getDatabase();
    const newSchedule = {
      patientId,
      practitionerId,
      therapyName,
      scheduledDate: new Date(scheduledDate),
      scheduledTime: scheduledTime || '',
      status: status || 'scheduled',
      precautions: precautions || [],
      feedback: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('therapySchedules').insertOne(newSchedule);
    newSchedule._id = result.insertedId;

    res.status(201).json({
      message: 'Therapy schedule created successfully',
      schedule: newSchedule
    });

  } catch (error) {
    console.error('Error creating therapy schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/therapy-schedule/practitioner/:practitionerId - Get all schedules for a practitioner
router.get('/therapy-schedule/practitioner/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const db = getDatabase();
    const schedules = await db.collection('therapySchedules')
      .find({ practitionerId })
      .sort({ scheduledDate: 1 })
      .toArray();
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching practitioner schedules:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/therapy-schedule/patient/:patientId - Get all schedules for a specific patient
router.get('/therapy-schedule/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const db = getDatabase();
    const schedules = await db.collection('therapySchedules')
      .find({ patientId })
      .sort({ scheduledDate: 1 })
      .toArray();
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching patient schedules:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/therapy-schedule/:id - Update a schedule (e.g., mark as completed)
router.put('/therapy-schedule/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { therapyName, scheduledDate, scheduledTime, status, precautions } = req.body;
    
    const db = getDatabase();
    const updateData = {
      updatedAt: new Date()
    };

    if (therapyName) updateData.therapyName = therapyName;
    if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
    if (scheduledTime !== undefined) updateData.scheduledTime = scheduledTime;
    if (status) updateData.status = status;
    if (precautions) updateData.precautions = precautions;

    const result = await db.collection('therapySchedules').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Therapy schedule not found' });
    }

    res.status(200).json({
      message: 'Therapy schedule updated successfully',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating therapy schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/therapy-schedule/feedback/:id - Add patient feedback to a specific therapy session
router.post('/therapy-schedule/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    
    if (!feedback) {
      return res.status(400).json({ error: 'Feedback is required' });
    }

    const db = getDatabase();
    const result = await db.collection('therapySchedules').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          feedback,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Therapy schedule not found' });
    }

    res.status(200).json({
      message: 'Feedback added successfully',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

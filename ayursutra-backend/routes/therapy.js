const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

// POST /api/therapy - Create a new therapy schedule
router.post('/', async (req, res) => {
  try {
    const { patientId, practitionerId, therapyName, scheduledDate, scheduledTime, status, precautions } = req.body;
    
    // Validation
    if (!patientId || !practitionerId || !therapyName || !scheduledDate) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Patient ID, practitioner ID, therapy name, and scheduled date are required' 
      });
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
      success: true,
      message: 'Therapy schedule created successfully',
      schedule: newSchedule
    });

  } catch (error) {
    console.error('Error creating therapy schedule:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create therapy schedule' 
    });
  }
});

// GET /api/therapy/practitioner/:practitionerId - Get all schedules for a practitioner
router.get('/practitioner/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const { status, date } = req.query;
    
    if (!practitionerId) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Practitioner ID is required' 
      });
    }

    const db = getDatabase();
    let query = { practitionerId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const schedules = await db.collection('therapySchedules')
      .find(query)
      .sort({ scheduledDate: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      schedules,
      count: schedules.length
    });
  } catch (error) {
    console.error('Error fetching practitioner schedules:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch therapy schedules' 
    });
  }
});

// GET /api/therapy/patient/:patientId - Get all schedules for a specific patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;
    
    if (!patientId) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Patient ID is required' 
      });
    }

    const db = getDatabase();
    let query = { patientId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const schedules = await db.collection('therapySchedules')
      .find(query)
      .sort({ scheduledDate: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      schedules,
      count: schedules.length
    });
  } catch (error) {
    console.error('Error fetching patient schedules:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch patient therapy schedules' 
    });
  }
});

// GET /api/therapy/:id - Get a specific therapy schedule
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Therapy schedule ID is required' 
      });
    }

    const db = getDatabase();
    const schedule = await db.collection('therapySchedules').findOne({ _id: new ObjectId(id) });
    
    if (!schedule) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Therapy schedule not found' 
      });
    }

    res.status(200).json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error('Error fetching therapy schedule:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch therapy schedule' 
    });
  }
});

// PUT /api/therapy/:id - Update a schedule (e.g., mark as completed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { therapyName, scheduledDate, scheduledTime, status, precautions } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Therapy schedule ID is required' 
      });
    }

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
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Therapy schedule not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Therapy schedule updated successfully',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating therapy schedule:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update therapy schedule' 
    });
  }
});

// POST /api/therapy/feedback/:id - Add patient feedback to a specific therapy session
router.post('/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Therapy schedule ID is required' 
      });
    }

    if (!feedback) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Feedback is required' 
      });
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
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Therapy schedule not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to add feedback' 
    });
  }
});

// DELETE /api/therapy/:id - Delete a therapy schedule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Therapy schedule ID is required' 
      });
    }

    const db = getDatabase();
    const result = await db.collection('therapySchedules').deleteOne(
      { _id: new ObjectId(id) }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Therapy schedule not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Therapy schedule deleted successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting therapy schedule:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete therapy schedule' 
    });
  }
});

// GET /api/therapy/stats/:practitionerId - Get therapy statistics for a practitioner
router.get('/stats/:practitionerId', async (req, res) => {
  try {
    const { practitionerId } = req.params;
    
    if (!practitionerId) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Practitioner ID is required' 
      });
    }

    const db = getDatabase();
    
    // Get total schedules
    const totalSchedules = await db.collection('therapySchedules').countDocuments({ practitionerId });
    
    // Get schedules by status
    const scheduledCount = await db.collection('therapySchedules').countDocuments({ 
      practitionerId, 
      status: 'scheduled' 
    });
    
    const completedCount = await db.collection('therapySchedules').countDocuments({ 
      practitionerId, 
      status: 'completed' 
    });
    
    const cancelledCount = await db.collection('therapySchedules').countDocuments({ 
      practitionerId, 
      status: 'cancelled' 
    });

    // Get today's schedules
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todaySchedules = await db.collection('therapySchedules').countDocuments({
      practitionerId,
      scheduledDate: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalSchedules,
        scheduled: scheduledCount,
        completed: completedCount,
        cancelled: cancelledCount,
        today: todaySchedules
      }
    });
  } catch (error) {
    console.error('Error fetching therapy stats:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch therapy statistics' 
    });
  }
});

module.exports = router;

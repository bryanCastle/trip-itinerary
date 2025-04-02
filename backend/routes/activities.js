const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Trip = require('../models/Trip');

// Get all activities for a trip
router.get('/trip/:tripId', async (req, res) => {
    try {
        const activities = await Activity.find({ tripId: req.params.tripId });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add activity to a trip
router.post('/trips/:tripId/activities', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Create a date object at noon UTC to avoid timezone issues
        const [year, month, day] = req.body.date.split('-');
        const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        
        const activityData = {
            ...req.body,
            date: date,
            tripId: req.params.tripId,
            creator: req.body.creator
        };

        const activity = new Activity(activityData);
        await activity.save();
        trip.activities.push(activity._id);
        await trip.save();

        // Emit socket event
        const io = req.app.get('io');
        io.to(`trip-${req.params.tripId}`).emit('activity-added', activity);

        res.status(201).json(activity);
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get a specific activity
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            res.json(activity);
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update activity
router.patch('/trips/:tripId/activities/:activityId', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Create update object with all fields
        const updateData = { ...req.body };

        // Handle date update if present
        if (updateData.date) {
            const [year, month, day] = updateData.date.split('-');
            // Create date at noon UTC to avoid timezone issues
            const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            updateData.date = date;
        }

        // Update the activity with all fields
        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.activityId,
            { $set: updateData },
            { new: true }
        );

        // Emit socket event
        const io = req.app.get('io');
        io.to(`trip-${req.params.tripId}`).emit('activity-updated', updatedActivity);

        res.json(updatedActivity);
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete activity
router.delete('/trips/:tripId/activities/:activityId', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const activity = await Activity.findById(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        trip.activities = trip.activities.filter(id => id.toString() !== req.params.activityId);
        await trip.save();
        await activity.deleteOne();

        // Emit socket event
        const io = req.app.get('io');
        io.to(`trip-${req.params.tripId}`).emit('activity-deleted', req.params.activityId);

        res.json({ message: 'Activity deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
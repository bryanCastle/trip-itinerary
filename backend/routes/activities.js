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

// Create a new activity
router.post('/', async (req, res) => {
    console.log('Creating activity with color:', req.body.color);
    const activity = new Activity({
        title: req.body.title,
        date: new Date(req.body.date), // Remove timezone manipulation
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        notes: req.body.notes,
        location: req.body.location,
        color: req.body.color,
        tripId: req.body.tripId
    });

    try {
        const newActivity = await activity.save();
        console.log('Saved activity with color:', newActivity.color);
        // Add activity to trip's activities array
        await Trip.findByIdAndUpdate(
            req.body.tripId,
            { $push: { activities: newActivity._id } }
        );
        res.status(201).json(newActivity);
    } catch (error) {
        console.error('Error creating activity:', error);
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

// Update an activity
router.patch('/:id', async (req, res) => {
    console.log('Updating activity with color:', req.body.color);
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            Object.assign(activity, req.body);
            const updatedActivity = await activity.save();
            console.log('Updated activity with color:', updatedActivity.color);
            res.json(updatedActivity);
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete an activity
router.delete('/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            // Remove activity from trip's activities array
            await Trip.findByIdAndUpdate(
                activity.tripId,
                { $pull: { activities: activity._id } }
            );
            // Use deleteOne instead of remove
            await Activity.deleteOne({ _id: activity._id });
            res.json({ message: 'Activity deleted' });
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
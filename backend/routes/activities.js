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

        const activity = new Activity({
            ...req.body,
            tripId: req.params.tripId
        });

        await activity.save();
        trip.activities.push(activity._id);
        await trip.save();

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

        Object.assign(activity, req.body);
        await activity.save();

        res.json(activity);
    } catch (error) {
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

        res.json({ message: 'Activity deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// Get all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find().populate('activities');
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new trip
router.post('/', async (req, res) => {
    try {
        console.log('Received trip creation request:', req.body);
        const trip = new Trip(req.body);
        console.log('Created new trip object:', trip);
        await trip.save();
        console.log('Trip saved successfully:', trip);
        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get a specific trip
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('activities');
        if (trip) {
            res.json(trip);
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a trip
router.patch('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (trip) {
            Object.assign(trip, req.body);
            const updatedTrip = await trip.save();
            res.json(updatedTrip);
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a trip
router.delete('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (trip) {
            await Trip.findByIdAndDelete(req.params.id);
            res.json({ message: 'Trip deleted' });
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
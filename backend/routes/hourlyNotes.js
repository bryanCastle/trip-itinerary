const express = require('express');
const router = express.Router();
const HourlyNote = require('../models/HourlyNote');

// Get all hourly notes for a trip
router.get('/trip/:tripId', async (req, res) => {
    try {
        const notes = await HourlyNote.find({ tripId: req.params.tripId });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create or update an hourly note
router.post('/', async (req, res) => {
    try {
        const { tripId, date, hour, note } = req.body;
        
        // Find existing note or create new one
        const existingNote = await HourlyNote.findOne({ tripId, date, hour });
        
        if (existingNote) {
            existingNote.note = note;
            const updatedNote = await existingNote.save();
            res.json(updatedNote);
        } else {
            const newNote = new HourlyNote({
                tripId,
                date,
                hour,
                note
            });
            const savedNote = await newNote.save();
            res.status(201).json(savedNote);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 
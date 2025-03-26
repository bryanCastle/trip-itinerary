const mongoose = require('mongoose');

const hourlyNoteSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    note: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HourlyNote', hourlyNoteSchema); 
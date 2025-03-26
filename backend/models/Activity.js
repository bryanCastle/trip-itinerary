const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    color: {
        type: String,
        default: '#3B82F6'
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Activity', activitySchema); 
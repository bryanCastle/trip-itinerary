const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Create a new user session
router.post('/create-session', async (req, res) => {
    try {
        const { name } = req.body;
        const sessionId = uuidv4();
        
        const user = new User({
            name,
            sessionId
        });
        
        await user.save();
        res.json({ sessionId, name });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user by session ID
router.get('/session/:sessionId', async (req, res) => {
    try {
        const user = await User.findOne({ sessionId: req.params.sessionId });
        if (user) {
            res.json({ name: user.name });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 
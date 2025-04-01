const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://trip-itinerary-frontend.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Routes
const tripRoutes = require('./routes/trips');
const activityRoutes = require('./routes/activities');
const hourlyNoteRoutes = require('./routes/hourlyNotes');

app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/hourly-notes', hourlyNoteRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;

// Add startup logs
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('CORS origins:', process.env.NODE_ENV === 'production' 
  ? ['https://trip-itinerary-frontend.onrender.com', 'http://localhost:3000']
  : 'http://localhost:3000');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  }); 
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
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  
  // Check if the frontend build exists
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving frontend:', err);
        res.status(500).send('Frontend build not found. Please ensure the frontend is built and deployed correctly.');
      }
    });
  } else {
    res.sendFile(indexPath);
  }
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;

// Add startup logs
console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('Frontend build path:', frontendBuildPath);
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
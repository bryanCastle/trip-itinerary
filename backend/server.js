const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://trip-itinerary-frontend.onrender.com', 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-itinerary', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const tripRoutes = require('./routes/trips');
const activityRoutes = require('./routes/activities');
const hourlyNoteRoutes = require('./routes/hourlyNotes');

app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/hourly-notes', hourlyNoteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
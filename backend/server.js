const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: ['https://trip-itinerary-frontend.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Join a trip room
  socket.on('join-trip', (tripId) => {
    socket.join(`trip-${tripId}`);
    console.log(`Client joined trip-${tripId}`);
  });

  // Leave a trip room
  socket.on('leave-trip', (tripId) => {
    socket.leave(`trip-${tripId}`);
    console.log(`Client left trip-${tripId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
const tripRoutes = require('./routes/trips');
const activityRoutes = require('./routes/activities');
const hourlyNoteRoutes = require('./routes/hourlyNotes');

app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/hourly-notes', hourlyNoteRoutes);

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
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  }); 
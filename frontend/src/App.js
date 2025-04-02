import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import CreateTrip from './components/CreateTrip';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/trips" element={<TripList />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="/trips/:userName" element={<TripList />} />
            <Route path="/trips/:userName/:id" element={<TripDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
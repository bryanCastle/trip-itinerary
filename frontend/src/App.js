import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TripList from './components/TripList';
import TripDetail from './components/TripDetail';
import CreateTrip from './components/CreateTrip';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TripList />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="/trips/:id" element={<TripDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
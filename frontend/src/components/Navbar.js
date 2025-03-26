import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Trip Itinerary
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              My Trips
            </Link>
            <Link
              to="/trips/new"
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              New Trip
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/trips');
      setTrips(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/trips/${tripId}`);
      if (response.status === 200) {
        setTrips(trips.filter(trip => trip._id !== tripId));
        console.log('Trip deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip._id} className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <button
              onClick={() => handleDeleteTrip(trip._id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete trip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <Link to={`/trips/${trip._id}`}>
              <h2 className="text-xl font-semibold mb-2">{trip.name}</h2>
              <p className="text-gray-600 mb-2">{trip.destination}</p>
              <div className="text-sm text-gray-500">
                <p>
                  {format(new Date(trip.startDate), 'MMM d, yyyy')} -{' '}
                  {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </p>
                <p>{trip.activities?.length || 0} activities</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {trips.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No trips found</p>
          <Link
            to="/trips/new"
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md"
          >
            Create Your First Trip
          </Link>
        </div>
      )}
    </div>
  );
}

export default TripList; 
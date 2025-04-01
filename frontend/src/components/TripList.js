import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips, deleteTrip } from '../api';
import { format, parseISO } from 'date-fns';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError(error.message || 'Error loading trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(id);
        fetchTrips();
      } catch (error) {
        console.error('Error deleting trip:', error);
        setError(error.message || 'Error deleting trip. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500 text-center">{error}</p>
        <button
          onClick={fetchTrips}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Link
          to="/trips/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Trip
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No trips yet. Create your first trip!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link
              key={trip._id}
              to={`/trips/${userName}/${trip._id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{trip.name}</h2>
                <p className="text-gray-600 mb-4">{trip.destination}</p>
                <div className="text-sm text-gray-500">
                  <p>{format(parseISO(trip.startDate), 'MMM d, yyyy')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}</p>
                  <p>{trip.activities.length} activities</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripList; 
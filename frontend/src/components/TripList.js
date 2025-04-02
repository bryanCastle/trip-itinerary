import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTrips, deleteTrip } from '../api';
import { format, parseISO } from 'date-fns';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const userName = localStorage.getItem('userName');
  const location = useLocation();

  useEffect(() => {
    fetchTrips();
  }, []);

  // Effect to handle refresh state from navigation
  useEffect(() => {
    if (location.state?.refresh) {
      fetchTrips();
      // Clear the refresh state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTrips();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
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

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setTripToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTrip(tripToDelete);
      fetchTrips();
      setShowDeleteConfirm(false);
      setTripToDelete(null);
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError(error.message || 'Error deleting trip. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTripToDelete(null);
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
            <div key={trip._id} className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <button
                onClick={(e) => handleDelete(trip._id, e)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200 z-10"
                title="Delete trip"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <Link
                to={`/trips/${userName}/${trip._id}`}
                className="block"
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
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Trip</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this trip? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripList; 
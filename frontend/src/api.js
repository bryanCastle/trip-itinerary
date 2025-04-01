const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createTrip = async (tripData) => {
  try {
    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

export const getTrips = async () => {
  try {
    console.log('Fetching trips from:', `${API_URL}/trips`);
    const response = await fetch(`${API_URL}/trips`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw new Error(`Failed to fetch trips: ${error.message}`);
  }
};

export const getTripById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/trips/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching trip:', error);
    throw error;
  }
};

export const updateTrip = async (id, tripData) => {
  try {
    const response = await fetch(`${API_URL}/trips/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

export const deleteTrip = async (id) => {
  try {
    const response = await fetch(`${API_URL}/trips/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

export const addActivity = async (tripId, activityData) => {
  try {
    const response = await fetch(`${API_URL}/activities/trips/${tripId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const updateActivity = async (tripId, activityId, activityData) => {
  try {
    const response = await fetch(`${API_URL}/activities/trips/${tripId}/activities/${activityId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (tripId, activityId) => {
  try {
    const response = await fetch(`${API_URL}/activities/trips/${tripId}/activities/${activityId}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
}; 
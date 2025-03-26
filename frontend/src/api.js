const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createTrip = async (tripData) => {
  try {
    const response = await fetch(`${API_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

export const getTrips = async () => {
  try {
    const response = await fetch(`${API_URL}/trips`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

export const getTripById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/trips/${id}`);
    return await response.json();
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
    return await response.json();
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
    return await response.json();
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

export const addActivity = async (tripId, activityData) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const updateActivity = async (tripId, activityId, activityData) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/activities/${activityId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (tripId, activityId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/activities/${activityId}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
}; 
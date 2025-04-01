const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth functions
export const login = async (name) => {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/users/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

// Trip functions
export const createTrip = async (tripData) => {
    const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tripData),
    });
    return response.json();
};

export const getTrips = async () => {
    const response = await fetch(`${API_URL}/trips`, {
        headers: getAuthHeaders(),
    });
    return response.json();
};

export const getTripById = async (id) => {
    const response = await fetch(`${API_URL}/trips/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.json();
};

export const updateTrip = async (id, tripData) => {
    const response = await fetch(`${API_URL}/trips/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(tripData),
    });
    return response.json();
};

export const deleteTrip = async (id) => {
    const response = await fetch(`${API_URL}/trips/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return response.json();
};

// Activity functions
export const addActivity = async (tripId, activityData) => {
    const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tripId, ...activityData }),
    });
    return response.json();
};

export const updateActivity = async (id, activityData) => {
    const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(activityData),
    });
    return response.json();
};

export const deleteActivity = async (id) => {
    const response = await fetch(`${API_URL}/activities/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return response.json();
};

// Hourly Note functions
export const saveHourlyNote = async (tripId, hour, note) => {
    const response = await fetch(`${API_URL}/hourly-notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tripId, hour, note }),
    });
    return response.json();
};

export const getHourlyNotes = async (tripId) => {
    const response = await fetch(`${API_URL}/hourly-notes/${tripId}`, {
        headers: getAuthHeaders(),
    });
    return response.json();
}; 
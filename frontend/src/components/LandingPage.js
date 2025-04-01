import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSession, getUserSession } from '../api';

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      getUserSession(sessionId)
        .then(userData => {
          setName(userData.name);
          navigate('/trips');
        })
        .catch(() => {
          // If session is invalid, clear it
          localStorage.removeItem('sessionId');
        });
    }

    // Start fade-in animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show name input after the main content fades in
      setTimeout(() => {
        setShowNameInput(true);
      }, 1000);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const { sessionId } = await createUserSession(name.trim());
      localStorage.setItem('sessionId', sessionId);
      navigate('/trips');
    } catch (error) {
      setError('Failed to create session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className={`text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-6xl mb-4 animate-bounce">😊</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Trip Itinerary</h1>
        
        <div className={`transition-opacity duration-1000 ${showNameInput ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-2xl text-gray-600 mb-6">Welcome!</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 
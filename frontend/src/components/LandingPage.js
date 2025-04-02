import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load existing users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);

    // Start fade-in animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name.trim()}`
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUsers(updatedUsers);
      setName('');
      setIsAddingNew(false);
      setShowNameInput(false);
      navigate(`/trips/${newUser.name}`);
    }
  };

  const selectUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate(`/trips/${user.name}`);
  };

  const handleAddProfile = () => {
    setIsAddingNew(true);
    setShowNameInput(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div 
        className={`max-w-4xl w-full space-y-8 p-8 bg-white rounded-lg shadow-lg transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">😊</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome to Trip Itinerary
          </h2>
          <p className="text-gray-600 mb-8">
            {users.length > 0 ? 'Select a profile or create a new one' : 'Create your first profile to get started'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => selectUser(user)}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-500 transition-colors duration-200">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-blue-500 transition-colors duration-200">
                {user.name}
              </span>
            </button>
          ))}

          {!isAddingNew && (
            <button
              onClick={handleAddProfile}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center group-hover:border-blue-500 transition-colors duration-200">
                <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-blue-500 transition-colors duration-200">
                Add Profile
              </span>
            </button>
          )}
        </div>

        {isAddingNew && (
          <form 
            className={`mt-8 space-y-6 transition-opacity duration-1000 ${showNameInput ? 'opacity-100' : 'opacity-0'}`}
            onSubmit={handleSubmit}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Profile Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter profile name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setShowNameInput(false);
                  setName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Create Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LandingPage; 
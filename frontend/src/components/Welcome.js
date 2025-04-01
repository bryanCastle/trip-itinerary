import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserSession, getUserSession } from '../api';

const Welcome = () => {
    const [name, setName] = useState('');
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
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        try {
            const { sessionId } = await createUserSession(name);
            localStorage.setItem('sessionId', sessionId);
            navigate('/trips');
        } catch (error) {
            setError('Failed to create session. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to Trip Itinerary
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your name to get started
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Get Started
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Welcome; 
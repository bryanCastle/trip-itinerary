import React, { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';

function ActivityForm({ onSubmit, onCancel, initialData, tripDates }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    color: '#3B82F6'
  });
  const [error, setError] = useState('');

  // Function to format date consistently
  const formatDateForInput = (date) => format(date, 'yyyy-MM-dd');
  const formatDateForDisplay = (date) => format(date, 'EEEE, MMM d');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (tripDates && tripDates.length > 0) {
      // Set default date to first day of trip
      setFormData(prev => ({
        ...prev,
        date: formatDateForInput(tripDates[0])
      }));
    }
  }, [initialData, tripDates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user changes the date
    if (name === 'date') {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Get the first and last dates of the trip
    const tripStartDate = tripDates[0];
    const tripEndDate = tripDates[tripDates.length - 1];
    const selectedDate = parseISO(formData.date);

    // Check if the selected date is within the trip date range
    if (!isWithinInterval(selectedDate, { start: tripStartDate, end: tripEndDate })) {
      setError(`The selected date must be between ${formatDateForDisplay(tripStartDate)} and ${formatDateForDisplay(tripEndDate)}`);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <select
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {tripDates.map((date) => (
            <option key={date.toISOString()} value={formatDateForInput(date)}>
              {formatDateForDisplay(date)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-12 h-8 rounded cursor-pointer"
          />
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: formData.color }}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {initialData ? 'Update Activity' : 'Add Activity'}
        </button>
      </div>
    </form>
  );
}

export default ActivityForm; 
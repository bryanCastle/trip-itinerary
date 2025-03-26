import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

function ActivityForm({ onSubmit, onCancel, initialData, tripDates }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (tripDates && tripDates.length > 0) {
      // Set default date to first day of trip
      setFormData(prev => ({
        ...prev,
        date: format(tripDates[0], 'yyyy-MM-dd')
      }));
    }
  }, [initialData, tripDates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            <option key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
              {format(date, 'EEEE, MMM d')}
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
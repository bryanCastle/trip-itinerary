import React, { useState, useEffect, useRef } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';

function ActivityForm({ onSubmit, onCancel, initialData, tripDates }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    color: '#3B82F6',
    activityType: 'other',
    creator: localStorage.getItem('userName') || 'Anonymous'
  });
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Activity type options with emojis
  const activityTypes = [
    { value: 'flight', label: '✈️ Flight', emoji: '✈️' },
    { value: 'eat', label: '🍽️ Eat', emoji: '🍽️' },
    { value: 'shopping', label: '🛍️ Shopping', emoji: '🛍️' },
    { value: 'sleep', label: '😴 Sleep', emoji: '😴' },
    { value: 'rest', label: '🛋️ Rest', emoji: '🛋️' },
    { value: 'other', label: '📝 Other', emoji: '📝' }
  ];

  // Function to get emoji only from label
  const getEmojiOnly = (value) => {
    return activityTypes.find(t => t.value === value)?.emoji || '📝';
  };

  // Function to format date consistently
  const formatDateForInput = (date) => format(date, 'yyyy-MM-dd');
  const formatDateForDisplay = (date) => format(date, 'EEEE, MMM d');

  useEffect(() => {
    if (initialData) {
      // Format the date properly when initializing from existing data
      const formattedData = {
        ...initialData,
        date: formatDateForInput(parseISO(initialData.date))
      };
      setFormData(formattedData);
    } else if (tripDates && tripDates.length > 0) {
      setFormData(prev => ({
        ...prev,
        date: formatDateForInput(tripDates[0])
      }));
    }
  }, [initialData, tripDates]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'date') {
      setError('');
    }
  };

  const handleTypeSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      activityType: value
    }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const tripStartDate = tripDates[0];
    const tripEndDate = tripDates[tripDates.length - 1];
    const selectedDate = parseISO(formData.date);

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
      
      <div className="flex items-end gap-4">
        <div className="flex-1">
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

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 text-right">
            Type
          </label>
          <div className="mt-1 flex items-center justify-end space-x-2">
            <span className="text-xl">{getEmojiOnly(formData.activityType)}</span>
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 flex items-center justify-center cursor-pointer"
              >
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-1 bg-white rounded-md shadow-lg min-w-[200px]">
                  <ul className="py-1">
                    {activityTypes.map((type) => (
                      <li
                        key={type.value}
                        onClick={() => handleTypeSelect(type.value)}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          formData.activityType === type.value ? 'bg-blue-50' : ''
                        }`}
                      >
                        {type.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
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
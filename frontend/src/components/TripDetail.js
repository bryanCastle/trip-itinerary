import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, updateTrip, addActivity, updateActivity, deleteActivity } from '../api';
import { format, eachDayOfInterval, isSameDay, parseISO, subDays, addDays } from 'date-fns';
import ActivityForm from './ActivityForm';
import { io } from 'socket.io-client';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [expandedDays, setExpandedDays] = useState([]);
  const [hourlyNotes, setHourlyNotes] = useState({});
  const [editingActivity, setEditingActivity] = useState(null);
  const [showNotes, setShowNotes] = useState(true);
  const [socket, setSocket] = useState(null);

  // Function to check if two activities overlap
  const doActivitiesOverlap = (activity1, activity2) => {
    const [start1, end1] = [activity1.startTime, activity1.endTime].map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const [start2, end2] = [activity2.startTime, activity2.endTime].map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    });

    return (start1 < end2 && end1 > start2);
  };

  // Function to group overlapping activities
  const groupOverlappingActivities = (activities) => {
    const groups = [];
    const used = new Set();

    activities.forEach((activity, index) => {
      if (used.has(index)) return;

      const group = [activity];
      used.add(index);

      activities.forEach((otherActivity, otherIndex) => {
        if (index !== otherIndex && !used.has(otherIndex) && doActivitiesOverlap(activity, otherActivity)) {
          group.push(otherActivity);
          used.add(otherIndex);
        }
      });

      groups.push(group);
    });

    return groups;
  };

  // Add this function after the existing functions
  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Function to fetch trip data
  const fetchTrip = async () => {
    try {
      const data = await getTripById(id);
      setTrip(data);
      // Initialize hourlyNotes from trip.notes if they exist
      if (data.notes) {
        setHourlyNotes(data.notes);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trip:', error);
      setError('Error loading trip. Please try again.');
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTrip();
  }, [id]);

  // Set up polling every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTrip();
    }, 30000); // 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && id) {
      // Join trip room
      socket.emit('join-trip', id);

      // Listen for activity updates
      socket.on('activity-added', (newActivity) => {
        setTrip(prevTrip => ({
          ...prevTrip,
          activities: [...prevTrip.activities, newActivity]
        }));
      });

      socket.on('activity-updated', (updatedActivity) => {
        setTrip(prevTrip => ({
          ...prevTrip,
          activities: prevTrip.activities.map(activity =>
            activity._id === updatedActivity._id ? updatedActivity : activity
          )
        }));
      });

      socket.on('activity-deleted', (deletedActivityId) => {
        setTrip(prevTrip => ({
          ...prevTrip,
          activities: prevTrip.activities.filter(activity => 
            activity._id !== deletedActivityId
          )
        }));
      });

      // Cleanup listeners
      return () => {
        socket.emit('leave-trip', id);
        socket.off('activity-added');
        socket.off('activity-updated');
        socket.off('activity-deleted');
      };
    }
  }, [socket, id]);

  const handleAddActivity = async (activityData) => {
    try {
      const response = await addActivity(id, {
        ...activityData,
        tripId: id
      });
      
      // Immediately fetch updated data after adding an activity
      fetchTrip();
      setShowActivityForm(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      setError('Error adding activity. Please try again.');
    }
  };

  const handleEditActivity = async (activityData) => {
    try {
      // Check if any changes were made
      const hasChanges = Object.keys(activityData).some(key => {
        return activityData[key] !== editingActivity[key];
      });

      // If no changes were made, just close the form
      if (!hasChanges) {
        setEditingActivity(null);
        setShowActivityForm(false);
        return;
      }

      // Format the activity data to match the expected structure
      const formattedData = {
        title: activityData.title,
        date: activityData.date,
        startTime: activityData.startTime,
        endTime: activityData.endTime,
        location: activityData.location === undefined ? editingActivity.location : activityData.location,
        color: activityData.color,
        type: activityData.type
      };

      await updateActivity(id, editingActivity._id, formattedData);

      // Immediately fetch updated data after editing an activity
      fetchTrip();
      setEditingActivity(null);
      setShowActivityForm(false);
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to update activity. Please try again.');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(id, activityId);
      // Immediately fetch updated data after deleting an activity
      fetchTrip();
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError('Error deleting activity. Please try again.');
    }
  };

  const toggleDay = (date) => {
    const dateString = date.toISOString();
    setExpandedDays(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString);
      } else {
        return [...prev, dateString];
      }
    });
  };

  const getHourlyNote = (date, hour) => {
    return hourlyNotes[`${date}-${hour}`] || '';
  };

  const handleHourlyNoteChange = async (date, hour, note) => {
    const newNotes = {
      ...hourlyNotes,
      [`${date}-${hour}`]: note
    };
    setHourlyNotes(newNotes);

    try {
      // Update the trip with the new notes
      await updateTrip(id, { notes: newNotes });
    } catch (error) {
      console.error('Error saving note:', error);
      // Revert the note change if saving fails
      setHourlyNotes(hourlyNotes);
    }
  };

  // Static time labels
  const timeLabels = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!trip) {
    return <div>Trip not found</div>;
  }

  // Parse dates and ensure they're valid
  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);

  // Only create the interval if both dates are valid
  const tripDates = startDate && endDate && endDate >= startDate
    ? eachDayOfInterval({
        start: startDate,
        end: endDate,
        inclusive: true
      })
    : [];

  // Function to format date consistently
  const formatDate = (date) => format(date, 'MMM d, yyyy');
  const formatDateWithDay = (date) => format(date, 'EEEE, MMM d');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <p className="text-gray-600">{trip.destination}</p>
          <p className="text-sm text-gray-500">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        </div>
        <button
          onClick={() => setShowActivityForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Activity
        </button>
      </div>

      {showActivityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h3>
            <ActivityForm
              onSubmit={editingActivity ? handleEditActivity : handleAddActivity}
              onCancel={() => {
                setShowActivityForm(false);
                setEditingActivity(null);
              }}
              initialData={editingActivity}
              tripDates={tripDates}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {tripDates.map((date) => {
          const dayActivities = trip.activities.filter((activity) =>
            isSameDay(parseISO(activity.date), date)
          );
          const isExpanded = expandedDays.includes(date.toISOString());
          const activityGroups = groupOverlappingActivities(dayActivities);

          return (
            <div
              key={date.toISOString()}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDay(date)}
              >
                <h3 className="text-lg font-semibold mb-4">
                  {formatDateWithDay(date)}
                </h3>
                <div className="space-y-4">
                  {dayActivities.map((activity) => {
                    console.log('Rendering activity with color:', activity.color);
                    return (
                      <div
                        key={activity._id}
                        className="pl-4"
                        style={{ borderLeft: `4px solid ${activity.color || '#3B82F6'}` }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-gray-600">
                              {convertTo12Hour(activity.startTime)} - {convertTo12Hour(activity.endTime)}
                            </p>
                            {activity.location && (
                              <p className="text-sm text-gray-500">
                                📍 {activity.location}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Suggested by {activity.creator}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingActivity(activity);
                                setShowActivityForm(true);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteActivity(activity._id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {dayActivities.length === 0 && (
                    <p className="text-gray-500 text-sm">No activities scheduled</p>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-6">
                  <h4 className="text-md font-semibold mb-4">Hourly Schedule</h4>
                  <div className="relative">
                    {/* Combined timeline with activities and notes */}
                    <div className="space-y-4">
                      {timeLabels.map((time, index) => {
                        const hourActivities = dayActivities.filter(activity => {
                          const [startHour] = activity.startTime.split(':').map(Number);
                          return startHour === index;
                        });

                        return (
                          <div key={time} className="flex items-start space-x-4">
                            <div className="w-20 text-sm text-gray-600">
                              {time}
                            </div>
                            <div className="flex-1 relative min-h-[60px] flex">
                              {/* Activities container */}
                              <div className="w-1/2 relative">
                                {hourActivities.map((activity, activityIndex) => {
                                  const [startHour, startMinute] = activity.startTime.split(':').map(Number);
                                  const [endHour, endMinute] = activity.endTime.split(':').map(Number);
                                  const startMinutes = startHour * 60 + startMinute;
                                  const endMinutes = endHour * 60 + endMinute;
                                  const duration = endMinutes - startMinutes;
                                  const topOffset = startMinute * (60 / 60);

                                  // Calculate height based on duration in hours with scaling factor
                                  const SCALING_FACTOR = 1.25; // Scale up blocks by 25%
                                  const durationInHours = duration / 60;
                                  const height = durationInHours * 60 * SCALING_FACTOR;

                                  return (
                                    <div
                                      key={activity._id}
                                      className="absolute left-0 right-0 border rounded-md p-2"
                                      style={{
                                        top: `${topOffset}px`,
                                        height: `${height}px`,
                                        backgroundColor: `${activity.color || '#3B82F6'}20`,
                                        borderColor: activity.color || '#3B82F6',
                                      }}
                                    >
                                      <div className="text-sm font-medium">{activity.title}</div>
                                      <div className="text-xs text-gray-600">
                                        {convertTo12Hour(activity.startTime)} - {convertTo12Hour(activity.endTime)}
                                      </div>
                                      {activity.location && (
                                        <div className="text-xs text-gray-500">
                                          📍 {activity.location}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Notes container */}
                              <div className="w-1/2 pl-4">
                                <textarea
                                  value={getHourlyNote(date, index)}
                                  onChange={(e) => handleHourlyNoteChange(date, index, e.target.value)}
                                  placeholder="Add notes for this hour..."
                                  className="w-full text-sm border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows="1"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TripDetail; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkoutForm from './components/WorkoutForm';
import WorkoutCard from './components/WorkoutCard';
import WorkoutDay from './components/WorkoutDay';
import { FaCalendarAlt, FaDumbbell } from 'react-icons/fa';

const Create = () => {
  const [showForm, setShowForm] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      try {
        const res = await axios.get('https://exercise-catalog.onrender.com/api/workouts', { withCredentials: true });
        if (Array.isArray(res.data)) {
          const sorted = res.data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
          setRecentWorkouts(sorted);
        }
      } catch (err) {
        console.error('Error fetching recent workouts:', err.message);
      }
    };
    fetchRecentWorkouts();

    const fetchUser = async () => {
      try {
        const res = await axios.get('https://exercise-catalog.onrender.com/api/current_user', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  if (loadingUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-sm animate-pulse">Checking login status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">You must be logged in to create and log workouts.</p>
        <a
          href="https://exercise-catalog.onrender.com/api/auth/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Log In
        </a>
      </div>
    );
  }

  const groupedRecent = recentWorkouts.reduce((acc, workout) => {
    const date = new Date(workout.date);
    const key = date.toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(workout);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-12 rounded-2xl bg-gray-50 shadow-inner border border-gray-200 px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">
          Recent Workouts
        </h2>
        <ul className="space-y-4">
          {Object.entries(groupedRecent).map(([day, workouts]) => (
            <div
              key={day}
              onClick={() => window.location.href = `/workouts/${workouts[0].id}`}
              className="cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5 bg-gradient-to-tr from-white to-gray-50 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.01] transition duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="text-2xl text-blue-600"><FaCalendarAlt /></div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {new Date(day).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {workouts.map((workout) => (
                      <li key={workout.id} className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                          <FaDumbbell />
                          {workout.name}
                        </div>
                        <p className="text-xs text-gray-500">
                          {workout.exercises?.length || 0} exercise{(workout.exercises?.length || 0) !== 1 && 's'}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <WorkoutCard />
      <div className="flex justify-center mb-6 mt-6">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="mb-6 bg-blue-600 text-white font-semibold py-2 px-5 rounded-full items-center gap-2 hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '➕ Create New Workout'}
        </button>
        </div>
      
      <div
        onClick={() => setShowForm(false)}
        className={`fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm flex justify-center items-start pt-20 transition-opacity duration-300 ${showForm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 transform transition-transform duration-500 ease-out ${showForm ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <WorkoutForm
            onCancel
            onSaved={() => {
              window.location.reload();
            }}

          />
        </div>
      </div>
    </div>
  );
};

export default Create;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';

const WorkoutCard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/workouts', { withCredentials: true });
  
        if (Array.isArray(res.data)) {
          setWorkouts(res.data);
        } else {
          console.error('Unexpected response format:', res.data);
          setWorkouts([]);
        }
      } catch (err) {
        console.error('Failed to fetch workouts:', err.response?.data || err.message);
        setWorkouts([]); // fallback to avoid crash
      }
    };
  
    fetchWorkouts();
  }, []);
  const getWorkoutsForDate = (date) => {
    return workouts.filter(workout =>
      isSameDay(new Date(workout.date), date)
    );
  };

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    new Date(currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-8 px-4 md:px-8 py-6 bg-gray-50 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
          className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 hover:shadow-md transition duration-200"
        >
          ◀ Prev
        </button>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Your Saved Workouts</h2>
          <p className="text-lg text-gray-500 mt-1">
            {format(currentWeekStart, 'MMM d')} – {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
          className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 hover:shadow-md transition duration-200"
        >
          Next ▶
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-7 gap-6 w-full">
          {daysOfWeek.map((date) => {
            const workoutsForDate = getWorkoutsForDate(date);
            return (
              <div
                key={date.toString()}
                className="bg-white shadow-sm border border-gray-200 rounded-2xl px-6 py-5 hover:shadow-md transition-all duration-200 w-full flex flex-col justify-between"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-4">{format(date, 'EEEE, MMM d')}</h3>
                <div className="space-y-3">
                  {workoutsForDate.length > 0 ? (
                    workoutsForDate.map((workout) => (
                      <div key={workout.id} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition">
                        <p
                          className="text-sm text-blue-700 font-semibold"
                          onClick={() => navigate(`/workouts/${workout.id}`)}
                        >
                          {workout.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">No workouts saved for this date.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
    </div>
  );
};

export default WorkoutCard;

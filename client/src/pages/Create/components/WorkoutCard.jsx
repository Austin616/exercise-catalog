import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import WorkoutDay from './WorkoutDay';


const WorkoutCard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get('https://exercise-catalog.onrender.com/api/workouts', { withCredentials: true });
  
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
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 px-6 py-8 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <div>
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
                <WorkoutDay
                  key={date.toString()}
                  date={date}
                  workouts={workoutsForDate}
                  onNavigate={navigate}
                />
              );
            })}
          </div>
        </div>

        
      </div>
    </motion.div>
  );
};

export default WorkoutCard;

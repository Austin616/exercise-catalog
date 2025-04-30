import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const WorkoutDay = ({ date, workouts }) => {
    const navigate = useNavigate();
    
    if (!(date instanceof Date) || isNaN(date)) {
      return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-6 py-5 text-gray-500 italic">
          Invalid date
        </div>
      );
    }

    return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-6 py-5 hover:shadow-md transition-all duration-200 w-full flex flex-col justify-between">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          {format(date, 'EEEE, MMM d')}
        </h3>
        <div className="space-y-3">
          {Array.isArray(workouts) && workouts.length > 0 ? (
            workouts.map((workout) => (
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
  };
export default WorkoutDay;  
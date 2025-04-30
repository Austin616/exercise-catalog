import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WorkoutForm from './components/WorkoutForm';

const WorkoutInstance = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/workouts/${id}`, { withCredentials: true });
        setWorkout(res.data);
      } catch (err) {
        console.error('Error fetching workout:', err);
      }
    };

    fetchWorkout();
  }, [id]);

  const toggleSetComplete = (exerciseIdx, setIdx) => {
    const key = `${exerciseIdx}-${setIdx}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!workout) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto pt-10 px-6">
      {!isEditing ? (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{workout.name}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-600">Date: {workout.date}</p>
          <p className="text-gray-700 whitespace-pre-line">{workout.notes}</p>
          <div className="space-y-4">
            {workout.exercises.map((exercise, exIdx) => (
              <div key={exIdx}>
                <h3 className="font-semibold text-gray-800 mb-1">{exercise.name}</h3>
                <ul className="space-y-1">
                  {exercise.sets.map((set, setIdx) => {
                    const key = `${exIdx}-${setIdx}`;
                    return (
                      <li
                        key={setIdx}
                        className={`flex justify-between items-center p-2 border rounded-md ${
                          completedSets[key] ? 'bg-green-100' : 'bg-gray-50'
                        }`}
                      >
                        <span>Reps: {set.reps}, Weight: {set.weight} lbs</span>
                        <input
                          type="checkbox"
                          checked={!!completedSets[key]}
                          onChange={() => toggleSetComplete(exIdx, setIdx)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(false)}
          className={`fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm flex justify-center items-start pt-20 transition-opacity duration-300 ${
            isEditing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 transform transition-transform duration-500 ease-out ${
              isEditing ? 'translate-y-0' : '-translate-y-full'
            }`}
          >
            <WorkoutForm
              initialData={workout}
              workoutId={workout.id}
              onCancel={() => setIsEditing(false)}
              onSaved={() => {
                setIsEditing(false);
                window.location.reload();
              }}
              canDelete={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutInstance;

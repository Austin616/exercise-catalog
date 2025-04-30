import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import LinearProgress from '@mui/material/LinearProgress';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import WorkoutForm from './components/WorkoutForm';
import { FaDumbbell, FaStickyNote, FaCalendar, FaCheckSquare, FaRegSquare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import exerciseJson from '../../../../backend/dist/exercises.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        // After the workout is fetched and loaded, calculate the max weight for each exercise
        if (res.data && res.data.exercises) {
          res.data.exercises.forEach((exercise) => {
            const setData = exercise.sets.map(set => ({
              reps: parseInt(set.reps) || 0,
              weight: parseInt(set.weight) || 0,
            }));

            const exerciseId = (exerciseJson.find(e => e.name === exercise.name)?.id) || exercise.name;
            axios.post(
              `http://127.0.0.1:5000/api/exercise_history/${encodeURIComponent(exerciseId)}`,
              {
                sets: setData,
                date: res.data.date
              },
              { withCredentials: true }
            ).then(() => {
                console.log('Exercise history posted successfully');
            }).catch(err => {
              console.error('Error posting exercise history:', err);
            });
          });
        }

        const completedRes = await axios.get(
          `http://127.0.0.1:5000/api/workouts/${id}/completed_sets`,
          { withCredentials: true }
        );
        setCompletedSets(completedRes.data.completedSets || {});
      } catch (err) {
        console.error('Error fetching workout:', err);
      }
    };

    fetchWorkout();
  }, [id]);

  const toggleSetComplete = (exerciseIdx, setIdx) => {
    const key = `${exerciseIdx}-${setIdx}`;
    setCompletedSets(prev => {
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key]; // remove from completed
      } else {
        updated[key] = true; // mark as completed
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!workout) return;

    const saveCompletedSets = async () => {
      try {
        await axios.post(
          `http://127.0.0.1:5000/api/workouts/${workout.id}/completed_sets`,
          { completedSets },
          { withCredentials: true }
        );
      } catch (err) {
        console.error('Error saving completed sets:', err);
      }
    };

    // Debounce saving for 500ms
    const timeout = setTimeout(saveCompletedSets, 500);
    return () => clearTimeout(timeout);
  }, [completedSets, workout]);

  if (!workout) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-6">
      {!isEditing ? (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-xl rounded-2xl px-10 py-8 border border-gray-100 space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FaDumbbell className="text-blue-500" /> {workout.name}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaCalendar className="text-green-600" /> {new Date(workout.date).toLocaleString()}
          </p>
          {workout.notes && (
            <p className="text-gray-800 whitespace-pre-line flex items-start gap-2">
              <FaStickyNote className="text-yellow-500 mt-1" />
              <span>{workout.notes}</span>
            </p>
          )}
          <div className="space-y-6">
            {workout.exercises.map((exercise, exIdx) => (
              <div key={exIdx} className="border border-gray-200 bg-gray-50 rounded-xl p-4 shadow-sm">
                <Link
                  to={`/exercises/instance/${
                    (exerciseJson.find(e => e.name === exercise.name)?.id) || encodeURIComponent(exercise.name)
                  }`}
                  className="flex items-center gap-2 mb-4"
                >
                <h3 className="font-semibold text-gray-800 mb-2">{exercise.name}</h3>
                </Link>
                <LinearProgress
                  variant="determinate"
                  value={
                    (exercise.sets.filter((_, setIdx) => completedSets[`${exIdx}-${setIdx}`]).length /
                      exercise.sets.length) * 100
                  }
                  sx={{
                    height: 10,
                    borderRadius: '9999px',
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#34d399'
                    }
                  }}
                />
                <ul className="space-y-2 mt-3">
                  {exercise.sets.map((set, setIdx) => {
                    const key = `${exIdx}-${setIdx}`;
                    return (
                      <li
                        key={setIdx}
                        className={`flex justify-between items-center px-4 py-3 border rounded-lg bg-white ${
                          completedSets[key] ? 'bg-green-100 border-green-300' : 'border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-800">
                          Reps: {set.reps}, Weight: {set.weight} lbs
                        </span>
                        <button
                          onClick={() => toggleSetComplete(exIdx, setIdx)}
                          className="focus:outline-none transition-transform transform hover:scale-105"
                        >
                          {completedSets[key] ? (
                            <FaCheckSquare className="text-green-500 w-6 h-6" />
                          ) : (
                            <FaRegSquare className="text-gray-400 w-6 h-6" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Performance Chart</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={exercise.sets.map((set, index) => ({
                        name: `Set ${index + 1}`,
                        Weight: parseInt(set.weight, 10) || 0
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Weight" fill="#34d399" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div
          onClick={() => {
            const hasEmptyFields = workout.exercises.some(ex =>
              !ex.name || ex.sets.some(set => !set.reps || !set.weight)
            );
            if (hasEmptyFields) {
              toast.error("Please fill out all reps and weights before closing.");
              return;
            }
            setIsEditing(false);
          }}
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import exercises from '../../../../../backend/dist/exercises.json';
import { FaPlus, FaTrashAlt, FaDumbbell, FaStickyNote, FaCalendar, FaSave } from 'react-icons/fa';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkoutForm = ({ initialData = null, workoutId = null, onCancel, onSaved, canDelete = false }) => {
  const [workoutName, setWorkoutName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.date ? new Date(initialData.date) : new Date());
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [exercisesInWorkout, setExercisesInWorkout] = useState(initialData?.exercises || []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/favorites', { withCredentials: true });
        setFavoriteExercises(res.data.map(fav => fav.exercise_name));
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      }
    };
    fetchFavorites();
  }, []);

  const addExercise = () => {
    setExercisesInWorkout(prev => [
      ...prev,
      {
        name: '',
        sets: [{ reps: '', weight: '' }]
      }
    ]);
  };

  const removeExercise = (idx) => {
    setExercisesInWorkout(prev => prev.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx, key, value) => {
    const updated = [...exercisesInWorkout];
    updated[idx][key] = value;
    setExercisesInWorkout(updated);
  };

  const updateSet = (exerciseIdx, setIdx, key, value) => {
    const updated = [...exercisesInWorkout];
    updated[exerciseIdx].sets[setIdx][key] = value;
    setExercisesInWorkout(updated);
  };

  const addSet = (exerciseIdx) => {
    const updated = [...exercisesInWorkout];
    updated[exerciseIdx].sets.push({ reps: '', weight: '' });
    setExercisesInWorkout(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (exercisesInWorkout.length === 0) {
      toast.error('Please add at least one exercise to the workout.');
      return;
    }
    // Additional validation: at least one exercise with name and one set with reps and weight
    const hasValidExercise = exercisesInWorkout.some(ex =>
      ex.name &&
      ex.sets &&
      ex.sets.some(set => set.reps && set.weight)
    );
    if (!hasValidExercise) {
      toast.error('Please fill out at least one set with reps and weight.');
      return;
    }
    try {
      const payload = {
        name: workoutName,
        date: date.toISOString(),
        notes,
        exercises: exercisesInWorkout,
      };
      const url = workoutId
        ? `http://127.0.0.1:5000/api/workouts/${workoutId}`
        : 'http://127.0.0.1:5000/api/workouts';
      const method = workoutId ? 'put' : 'post';

      const res = await axios[method](url, payload, { withCredentials: true });
      console.log('posted url:', res);

      console.log('Workout saved:', res.data);
      if (onSaved) onSaved();
      if (!workoutId) {
        setWorkoutName('');
        setDate(new Date());
        setNotes('');
        setExercisesInWorkout([]);
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to save workout:', err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!workoutId) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/api/workouts/${workoutId}`, { withCredentials: true });
      toast.success('Workout deleted successfully');
      window.location.href = '/create';
    } catch (err) {
      toast.error('Failed to delete workout');
      console.error('Delete error:', err);
    }
  };

  // Group exercises by muscle group for Select options
  const groupedByMuscle = exercises.reduce((groups, exercise) => {
    const group = exercise.primaryMuscles?.[0] || 'Other';
    if (!groups[group]) groups[group] = [];
    groups[group].push({ label: exercise.name, value: exercise.name });
    return groups;
  }, {});
  const groupedExerciseOptions = Object.entries(groupedByMuscle).map(([muscle, options]) => ({
    label: muscle,
    options,
  }));

return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-[600px] h-[80vh] mx-auto pt-16 pb-16 px-6 overflow-y-auto"
    >
      
        <form className="bg-white shadow-xl rounded-2xl px-10 py-8 mb-6 border border-gray-100 space-y-6">
          <div className="mb-5">
            <label className="flex text-gray-700 font-semibold mb-1 items-center gap-2">
              <FaDumbbell className="text-blue-500" /> Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={e => setWorkoutName(e.target.value)}
              placeholder="Enter workout name"
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label className="text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FaCalendar className="text-green-600" /> Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select date"
                className='w-full'
                value={date}
                onChange={(newValue) => setDate(newValue)}
                textField={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <AnimatePresence>
          {exercisesInWorkout.map((exercise, exIdx) => (
            <motion.div
              key={exIdx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-6 border border-gray-100 p-5 rounded-xl shadow bg-gray-50"
            >
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold">Exercise Name</label>
                {exIdx > 0 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(exIdx)}
                    className="text-red-500 text-xs transition hover:font-bold"
                  >
                    <FaTrashAlt className="text-red-500 hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
              <Select
                className="mb-3"
                options={[
                  {
                    label: 'Favorites ❤️',
                    options: favoriteExercises.map(name => ({ label: name, value: name }))
                  },
                  ...groupedExerciseOptions
                ]}
                value={{ label: exercise.name, value: exercise.name }}
                onChange={(selected) => updateExercise(exIdx, 'name', selected.value)}
                placeholder="Select an exercise"
                isSearchable
              />

              {exercise.sets.map((set, setIdx) => (
                <motion.div
                  key={setIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 mb-2"
                >
                  <input
                    type="number"
                    min={0}
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                    className="w-1/2 border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Weight (lbs)"
                    value={set.weight}
                    onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                    className="w-1/2 border rounded px-2 py-1"
                  />
                </motion.div>
              ))}
              <button
                type="button"
                onClick={() => addSet(exIdx)}
                className="text-blue-600 text-sm hover:underline mt-2"
              >
                <FaPlus className="inline-block mr-1" /> Add Set
              </button>
            </motion.div>
          ))}
          </AnimatePresence>

          <div className="mb-6">
            <button
              type="button"
              onClick={addExercise}
              className="bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition w-full text-sm"
            >
              <FaPlus className="inline-block mr-2" /> Add Exercise
            </button>
          </div>

          <div className="mb-6">
            <label className="text-gray-700 font-semibold mb-1 flex items-center gap-2">
              <FaStickyNote className="text-yellow-500" /> Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes about the workout..."
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition text-sm"
              onClick={handleSubmit}
            >
              <FaSave className="inline-block mr-2" /> Save Workout
            </button>
            {onCancel && (
              <button
                type="button"
                className="text-sm text-gray-500 underline hover:text-gray-700"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-red-600 underline hover:text-red-800 ml-4"
              >
                Delete Workout
              </button>
            )}
          </div>
        </form>
      </motion.div>
  );
};

export default WorkoutForm;

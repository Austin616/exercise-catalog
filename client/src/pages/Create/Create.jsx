import React, { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';

const Create = () => {
  const [showForm, setShowForm] = useState(false);
  const [workouts, setWorkouts] = useState([]); // Placeholder, assume no saved workouts yet
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateWorkout = (e) => {
    e.preventDefault();
    console.log('Workout created:', formData); // Replace with actual save logic later
    setWorkouts([...workouts, formData]);
    setFormData({ name: '', date: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex justify-center">Your Saved Workouts</h1>
      {workouts.length === 0 ? (
        <p className="text-gray-500 mb-6 flex justify-center">No workouts saved yet.</p>
      ) : (
        <ul className="mb-6">
          {workouts.map((w, i) => (
            <li key={i} className="mb-2 p-4 border rounded">
              <strong>{w.name}</strong> on {w.date}
              <p className="text-sm text-gray-600">{w.notes}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center mb-6">
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
            formData={formData}
            handleChange={handleChange}
            handleCreateWorkout={handleCreateWorkout}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;

import React, { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutCard from './components/WorkoutCard';

const Create = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto">
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

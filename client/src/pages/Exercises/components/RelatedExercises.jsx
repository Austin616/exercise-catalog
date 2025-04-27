import React, { useState, useEffect } from 'react';
import exerciseJson from '../../../../../backend/dist/exercises.json';
import ExerciseCard from './ExerciseCard';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const RelatedExercises = ({ currentExercise }) => {
  const [muscleExercises, setMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const [muscleScroll, setMuscleScroll] = useState(0);
  const [equipmentScroll, setEquipmentScroll] = useState(0);

  useEffect(() => {
    // Find and shuffle exercises that share the same primary muscles
    const filteredMuscleExercises = exerciseJson.filter(ex => {
      if (ex.id === currentExercise.id) return false;
      return currentExercise.primaryMuscles.some(muscle => 
        ex.primaryMuscles.includes(muscle)
      );
    });
    setMuscleExercises(shuffleArray(filteredMuscleExercises).slice(0, 4));

    // Find and shuffle exercises that share the same equipment
    const filteredEquipmentExercises = exerciseJson.filter(ex => {
      if (ex.id === currentExercise.id) return false;
      return currentExercise.equipment === ex.equipment;
    });
    setEquipmentExercises(shuffleArray(filteredEquipmentExercises).slice(0, 4));
  }, [currentExercise.id]); // Only reshuffle when the exercise ID changes

  const scroll = (direction, type) => {
    const container = document.getElementById(`${type}-container`);
    const scrollAmount = 300; // Adjust this value based on your card width
    const newScroll = type === 'muscle' ? 
      Math.max(0, Math.min(muscleScroll + (direction * scrollAmount), container.scrollWidth - container.clientWidth)) :
      Math.max(0, Math.min(equipmentScroll + (direction * scrollAmount), container.scrollWidth - container.clientWidth));
    
    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });

    if (type === 'muscle') {
      setMuscleScroll(newScroll);
    } else {
      setEquipmentScroll(newScroll);
    }
  };

  return (
    <div className="space-y-8 px-4">
      {/* Muscle Group Exercises */}
      {muscleExercises.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Other {currentExercise.primaryMuscles[0]} Exercises
          </h2>
          <div className="relative">
            <button
              onClick={() => scroll(-1, 'muscle')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              id="muscle-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide px-8"
              style={{ scrollbarWidth: 'none' }}
            >
              {muscleExercises.map(exercise => (
                <div key={exercise.id} className="min-w-[280px]">
                  <ExerciseCard exercise={exercise} />
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll(1, 'muscle')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Equipment Exercises */}
      {equipmentExercises.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            More {currentExercise.equipment || "Bodyweight"} Exercises
          </h2>
          <div className="relative">
            <button
              onClick={() => scroll(-1, 'equipment')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              id="equipment-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide px-8"
              style={{ scrollbarWidth: 'none' }}
            >
              {equipmentExercises.map(exercise => (
                <div key={exercise.id} className="min-w-[280px]">
                  <ExerciseCard exercise={exercise} />
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll(1, 'equipment')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedExercises; 
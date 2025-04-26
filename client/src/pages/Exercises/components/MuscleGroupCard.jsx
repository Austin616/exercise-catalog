import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import exerciseJson from "../../../../../backend/dist/exercises.json";
import muscleDescriptions from "../../../../../backend/muscleDescriptions.js";

const muscleIcons = {
  abdominals: "💪",
  hamstrings: "🦵",
  adductors: "🦿",
  quadriceps: "🦵",
  biceps: "💪",
  shoulders: "🏋️‍♂️",
  chest: "🧍‍♂️",
  calves: "👟",
  glutes: "🍑",
  lats: "🛶",
  "middle back": "🧘",
  "lower back": "🪑",
  traps: "🧍",
  default: "🏋️",
};

const MuscleGroupCard = ({ muscleGroup, maxMuscleGroup, searchTerm = '' }) => {
  const [numberOfExercises, setNumberOfExercises] = useState(0);
  const key = muscleGroup.toLowerCase().replace(/\s/g, "");
  const displayIcon = muscleIcons[muscleGroup.toLowerCase()] || muscleIcons.default;

  useEffect(() => {
    const count = exerciseJson.filter((exercise) =>
      exercise.primaryMuscles.includes(muscleGroup)
    ).length;
    setNumberOfExercises(count);
  }, [muscleGroup]);

  const isMostPopular = muscleGroup === maxMuscleGroup;
  const isHighVariety = numberOfExercises >= 50;
  const isMidVariety = numberOfExercises >= 25 && numberOfExercises < 50;
  const isLowVariety = numberOfExercises < 25;

  // Function to highlight matching text
  const highlightText = (text) => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Check if the muscle group matches the search term
  const isMatch = searchTerm && muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <Link
      to={`/exercises/${muscleGroup.toLowerCase().replace(/\s/g, "-")}`}
      className={`group bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-blue-300 flex flex-col justify-between active:scale-95 ${
        isMostPopular ? 'ring-2 ring-yellow-400' : ''
      } ${isMatch ? 'ring-2 ring-yellow-400' : ''}`}
    >
      {/* Icon Badge */}
      <div className="flex items-center justify-center mb-4">
        <div className={`w-16 h-16 flex items-center justify-center rounded-full text-4xl group-hover:bg-blue-200 transition ${
          isMostPopular ? 'bg-yellow-100' : isMatch ? 'bg-yellow-100' : 'bg-blue-100'
        }`}>
          {displayIcon}
        </div>
      </div>

      {/* Title */}
      <h2 className={`text-xl font-bold mb-2 capitalize text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center ${
        isMostPopular || isMatch ? 'text-yellow-600' : ''
      }`}>
        {highlightText(muscleGroup)}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 text-center">
        {highlightText(muscleDescriptions[key] || "Strengthen this muscle group with focused exercises.")}
      </p>

      {/* Exercise Count and Badges */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">
          {numberOfExercises} exercises
        </p>

        {/* Tags */}
        {isMostPopular ? (
          <span className="text-xs font-semibold text-yellow-500">🏆 Most Versatile</span>
        ) : isHighVariety ? (
          <span className="text-xs font-semibold text-green-500">🔥 High Variety</span>
        ) : isMidVariety ? (
          <span className="text-xs font-semibold text-blue-500">💪 Mid Variety</span>
        ) : isLowVariety ? (
          <span className="text-xs font-semibold text-gray-500">⚡ Low Variety</span>
        ) : null}
      </div>
    </Link>
  );
};

export default MuscleGroupCard;
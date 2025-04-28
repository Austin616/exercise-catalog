import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import exerciseJson from "../../../../../backend/dist/exercises.json";
import muscleDescriptions from "../../../../../backend/muscleDescriptions.js";

const muscleIcons = {
  abdominals: "😰",
  hamstrings: "🍖",
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
      className="group bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-blue-300 active:scale-95"
    >
      {/* Icon Badge */}
      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
        <span className="text-4xl">{displayIcon}</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-3 capitalize group-hover:text-blue-600 transition-colors duration-300">
        {highlightText(muscleGroup)}
      </h2>

      {/* Description */}
      <p className="text-base text-gray-500 mb-4 leading-relaxed">
        {highlightText(muscleDescriptions[key] || "Strengthen this muscle group with focused exercises.")}
      </p>

      {/* Exercise Count */}
      <p className="text-sm text-gray-400 mb-2">
        {numberOfExercises} exercises
      </p>

      {/* Variety Badges */}
      {isMostPopular ? (
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-500">
          🏆 Most Versatile
        </span>
      ) : isHighVariety ? (
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-500">
          🔥 High Variety
        </span>
      ) : isMidVariety ? (
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500">
          💪 Mid Variety
        </span>
      ) : isLowVariety ? (
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400">
          ⚡ Low Variety
        </span>
      ) : null}
    </Link>
  );
};

export default MuscleGroupCard;
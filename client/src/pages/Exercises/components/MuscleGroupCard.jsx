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

const MuscleGroupCard = ({ muscleGroup }) => {
  const [numberOfExercises, setNumberOfExercises] = useState(0);
  const key = muscleGroup.toLowerCase().replace(/\s/g, "");
  const displayIcon = muscleIcons[muscleGroup.toLowerCase()] || muscleIcons.default;

  useEffect(() => {
    const count = exerciseJson.filter((exercise) =>
      exercise.primaryMuscles.includes(muscleGroup)
    ).length;
    setNumberOfExercises(count);
  }, [muscleGroup]);

  return (
    <div className="group bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-blue-300 flex flex-col justify-between">
      
      {/* Icon */}
      <div className="text-5xl mb-3 transform transition-transform duration-500 group-hover:scale-100 group-hover:rotate-3">
        {displayIcon}
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2 capitalize text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
        {muscleGroup}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">
        {muscleDescriptions[key] || "Strengthen this muscle group with focused exercises."}
      </p>

      {/* Exercise Count */}
      <p className="text-xs text-gray-500 mb-4">Exercises: {numberOfExercises}</p>

      {/* Button */}
      <Link
        to={`/exercises/${muscleGroup.toLowerCase().replace(/\s/g, "-")}`}
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded transition"
      >
        View Exercises
      </Link>
    </div>
  );
};

export default MuscleGroupCard;
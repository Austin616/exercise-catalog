import React from 'react';
import { Link } from 'react-router-dom';
import muscleDescriptions from '../../../utils/muscleDescriptions.js';

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

const MuscleGroupListItem = ({ muscleGroup, count, isMostPopular }) => {
  const key = muscleGroup.toLowerCase().replace(/\s/g, "");
  const displayIcon = muscleIcons[muscleGroup.toLowerCase()] || muscleIcons.default;

  return (
    <Link
      to={`/exercises/${muscleGroup.toLowerCase().replace(/\s/g, "-")}`}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-blue-300 active:scale-95"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl ${
            isMostPopular ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            {displayIcon}
          </div>
          <div>
            <h2 className={`text-xl font-semibold capitalize ${
              isMostPopular ? 'text-yellow-600' : 'text-gray-900'
            }`}>
              {muscleGroup}
            </h2>
            <p className="text-sm text-gray-600">
              {muscleDescriptions[key] || "Strengthen this muscle group with focused exercises."}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">
            {count} exercises
          </p>
          {isMostPopular && (
            <span className="text-xs font-semibold text-yellow-500">🏆 Most Versatile</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MuscleGroupListItem; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { tagColors } from '../../../utils/tagColors';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExerciseListItem = ({ exercise }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    setIsFavorite(!isFavorite);
    // Show toast notification
    toast(
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <span>{isFavorite ? 'Removed from favorites' : 'Added to favorites'}</span>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
    // TODO: Add SQL integration for favorites
  };

  return (
    <Link
      to={`/exercises/instance/${exercise.id}`}
      className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    ><div className="flex justify-between items-center gap-4">
<div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {exercise.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {exercise.primaryMuscles.map((muscle, index) => (
              <span 
                key={index} 
                className={`px-2 py-1 ${tagColors.category.bg} ${tagColors.category.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.category.hover}`}
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center justify-center flex-wrap gap-2 text-center">
        {/* Favorite Button */}
  <button
    onClick={handleFavoriteClick}
    className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200"
    aria-label="Add to favorites"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  {exercise.equipment && (
    <span className={`px-2 py-1 ${tagColors.equipment.bg} ${tagColors.equipment.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.equipment.hover}`}>
      {exercise.equipment}
    </span>
  )}
  {exercise.level && (
    <span className={`px-2 py-1 ${tagColors.level.bg} ${tagColors.level.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.level.hover}`}>
      {exercise.level}
    </span>
  )}
  {exercise.force && (
    <span className={`px-2 py-1 ${tagColors.force.bg} ${tagColors.force.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.force.hover}`}>
      {exercise.force}
    </span>
  )}
</div>
      </div>
    </Link>
  );
};

export default ExerciseListItem; 
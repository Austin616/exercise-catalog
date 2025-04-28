import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { tagColors } from '../../../utils/tagColors'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ExerciseCard = ({ exercise, searchTerm = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
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
  };

  if (!exercise) return null;

  const isTagMatch = (value) => {
    if (!searchTerm) return false;
    return value?.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <Link
      to={`/exercises/instance/${exercise.id}`}
      className="group bg-white rounded-2xl shadow-lg w-full aspect-[3/4] max-w-[280px] p-6 flex flex-col justify-between items-center text-center hover:shadow-2xl transition-all duration-300 relative"
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-200"
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

      {/* Image in circle */}
      <div className="bg-blue-100 p-4 rounded-full flex items-center justify-center mb-4">
        <img
          src={`/exercises/${exercise.images?.[0] || 'default.jpg'}`}
          alt={exercise.name || 'Exercise'}
          className="w-16 h-16 object-cover rounded-full"
        />
      </div>

      {/* Exercise Name */}
      <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
        {highlightText(exercise.name || '')}
      </h2>

      {/* Short Tagline */}
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {exercise.description || 'Improve your strength and stability.'}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap justify-center gap-2 text-xs font-medium mt-auto">
        {exercise.force && (
          <span className={`${tagColors.force.bg} ${tagColors.force.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.force.hover} ${isTagMatch(exercise.force) ? 'ring-2 ring-yellow-400' : ''}`}>
            {highlightText(exercise.force)}
          </span>
        )}
        {exercise.equipment && (
          <span className={`${tagColors.equipment.bg} ${tagColors.equipment.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.equipment.hover} ${isTagMatch(exercise.equipment) ? 'ring-2 ring-yellow-400' : ''}`}>
            {highlightText(exercise.equipment)}
          </span>
        )}
        {exercise.level && (
          <span className={`${tagColors.level.bg} ${tagColors.level.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.level.hover} ${isTagMatch(exercise.level) ? 'ring-2 ring-yellow-400' : ''}`}>
            {highlightText(exercise.level)}
          </span>
        )}
        {exercise.category && (
          <span className={`${tagColors.category.bg} ${tagColors.category.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.category.hover} ${isTagMatch(exercise.category) ? 'ring-2 ring-yellow-400' : ''}`}>
            {highlightText(exercise.category)}
          </span>
        )}
      </div>
    </Link>
  )
}

export default ExerciseCard
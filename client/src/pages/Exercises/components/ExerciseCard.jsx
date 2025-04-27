import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { tagColors } from '../../../utils/tagColors'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ExerciseCard = ({ exercise, searchTerm = '' }) => {
  const [isFavorite, setIsFavorite] = useState(false);

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

  if (!exercise) return null;

  // Check if any tag matches the search term
  const isTagMatch = (value) => {
    if (!searchTerm) return false;
    return value?.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <Link
      to={`/exercises/instance/${exercise.id}`}
      className="group bg-white rounded-xl shadow-lg w-full aspect-[3/4] max-w-[280px] p-5 flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-blue-300 relative"
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
      
      {/* Image */}
      <img
        src={`/exercises/${exercise.images?.[0] || 'default.jpg'}`}
        alt={exercise.name || 'Exercise'}
        className="w-full h-[160px] object-cover rounded-lg mb-4"
      />

      {/* Name */}
      <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
        {highlightText(exercise.name || '')}
      </h2>

      {/* Info Badges */}
      <div className="flex flex-wrap justify-center gap-2 text-xs font-medium mt-auto">
        <span className={`${tagColors.force.bg} ${tagColors.force.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.force.hover} ${isTagMatch(exercise.force) ? 'ring-2 ring-yellow-400' : ''}`}>
          {highlightText(exercise.force || '')}
        </span>
        <span className={`${tagColors.equipment.bg} ${tagColors.equipment.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.equipment.hover} ${isTagMatch(exercise.equipment) ? 'ring-2 ring-yellow-400' : ''}`}>
          {highlightText(exercise.equipment || 'No equipment required')}
        </span>
        <span className={`${tagColors.level.bg} ${tagColors.level.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.level.hover} ${isTagMatch(exercise.level) ? 'ring-2 ring-yellow-400' : ''}`}>
          {highlightText(exercise.level || '')}
        </span>
        <span className={`${tagColors.category.bg} ${tagColors.category.text} px-3 py-1 rounded-full capitalize transition group-hover:scale-105 ${tagColors.category.hover} ${isTagMatch(exercise.category) ? 'ring-2 ring-yellow-400' : ''}`}>
          {highlightText(exercise.category || '')}
        </span>
      </div>
    </Link>
  )
}

export default ExerciseCard
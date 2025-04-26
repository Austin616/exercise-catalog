import React from 'react'
import { Link } from 'react-router-dom'
import { tagColors } from '../../../utils/tagColors'

const ExerciseCard = ({ exercise, searchTerm = '' }) => {
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

  if (!exercise) return null;

  // Check if any tag matches the search term
  const isTagMatch = (value) => {
    if (!searchTerm) return false;
    return value?.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <Link
      to={`/exercises/instance/${exercise.id}`}
      className="group bg-white rounded-xl shadow-lg w-full aspect-[3/4] max-w-[300px] p-5 flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-blue-300"
    >
      
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
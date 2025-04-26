import React from 'react'

const ExerciseCard = ({ exercise }) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg w-full aspect-[3/4] max-w-[300px] p-5 flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-blue-300">
      
      {/* Image (no hover effect here) */}
      <img
        src={exercise.images[0]}
        alt={exercise.name}
        className="w-full h-[160px] object-cover rounded-lg mb-4"
      />

      {/* Name */}
      <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
        {exercise.name}
      </h2>

      {/* Info Badges */}
      <div className="flex flex-wrap justify-center gap-2 text-xs font-medium mt-auto">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize transition group-hover:scale-105 group-hover:bg-blue-200">
          {exercise.force}
        </span>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full capitalize transition group-hover:scale-105 group-hover:bg-green-200">
          {exercise.equipment}
        </span>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full capitalize transition group-hover:scale-105 group-hover:bg-yellow-200">
          {exercise.level}
        </span>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full capitalize transition group-hover:scale-105 group-hover:bg-purple-200">
          {exercise.category}
        </span>
      </div>
    </div>
  )
}

export default ExerciseCard
import React from 'react';
import { Link } from 'react-router-dom';
import { tagColors } from '../../../utils/tagColors';

const ExerciseListItem = ({ exercise }) => {
  return (
    <Link
      to={`/exercises/instance/${exercise.id}`}
      className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
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
        <div className="flex flex-col items-end gap-2">
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
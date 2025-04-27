import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import exerciseJson from "../../../../backend/dist/exercises.json";
import BackButton from "../../components/BackButton";
import { tagColors } from "../../utils/tagColors";
import RelatedExercises from "./components/RelatedExercises";
import ExerciseVideo from "./components/ExerciseVideo";

const ExerciseInstance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = exerciseJson.find(ex => ex.id === id);
  const [activeImage, setActiveImage] = useState(0);

  const handleMuscleClick = (muscle) => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Navigate to muscle page
    navigate(`/exercises/${muscle.toLowerCase().replace(/\s+/g, '-')}`);
  };

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Exercise not found 😢
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="w-full max-w-7xl px-8 mb-4">
        <BackButton />
      </div>

      {/* Exercise Name */}
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        {exercise.name}
      </h1>

      {/* Exercise Images */}
      <div className="mb-8 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
        {exercise.images.map((image, index) => (
          <img
            key={index}
            src={`/exercises/${image}`}
            alt={`${exercise.name} - ${index === 0 ? 'Start' : 'End'} Position`}
            className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-200 ${
              activeImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div 
          className="absolute inset-0 cursor-pointer"
          onMouseEnter={() => setActiveImage(1)}
          onMouseLeave={() => setActiveImage(0)}
        >
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/50 rounded-full px-6 py-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
            Hover to see {activeImage === 0 ? 'end' : 'start'} position
          </div>
        </div>
      </div>

      {/* Exercise Video */}
      <ExerciseVideo exerciseName={exercise.name} />

      {/* Exercise Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {[
          { 
            title: "Equipment", 
            value: exercise.equipment || "No equipment required",
            tagStyle: `${tagColors.equipment.bg} ${tagColors.equipment.text}`
          },
          { 
            title: "Level", 
            value: exercise.level,
            tagStyle: `${tagColors.level.bg} ${tagColors.level.text}`
          },
          { 
            title: "Force", 
            value: exercise.force,
            tagStyle: `${tagColors.force.bg} ${tagColors.force.text}`
          },
          { 
            title: "Category", 
            value: exercise.category,
            tagStyle: `${tagColors.category.bg} ${tagColors.category.text}`
          }
        ].filter(detail => detail.value).map((detail, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-gray-500 text-sm mb-2">{detail.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${detail.tagStyle}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Instructions
        </h2>
        <ol className="list-decimal list-inside space-y-4">
          {exercise.instructions.map((instruction, index) => (
            <li
              key={index}
              className="text-gray-700 pl-2 text-lg leading-relaxed"
            >
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      {/* Muscles */}
      {["Primary", "Secondary"].map((type, idx) => (
        <div
          key={type}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            {type} Muscles
          </h2>
          <div className="flex flex-wrap gap-2">
            {exercise[`${type.toLowerCase()}Muscles`].map((muscle, index) => (
              <Link
                key={index}
                to={`/exercises/${muscle.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleMuscleClick(muscle)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize shadow-sm transition-transform duration-200 hover:scale-105
                  ${type === "Primary" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}`}
              >
                {muscle}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Related Exercises */}
      <RelatedExercises currentExercise={exercise} />
    </div>
  );
};

export default ExerciseInstance; 
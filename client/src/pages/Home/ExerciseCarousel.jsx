import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import exerciseJson from '../../../../backend/dist/exercises.json';

const ExerciseCarousel = () => {
  const navigate = useNavigate();
  // Get 5 random exercises for the carousel
  const featuredExercises = exerciseJson
    .filter(ex => ex.images && ex.images.length > 0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredExercises.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredExercises.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredExercises.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredExercises.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleExerciseClick = (exerciseId, e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/exercises/instance/${exerciseId}`);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl">
      {/* Carousel container */}
      <div 
        className="relative h-[400px] bg-gray-900"
      >
        {/* Exercise cards */}
        {featuredExercises.map((exercise, index) => (
          <Link
            key={exercise.id}
            to={`/exercises/instance/${exercise.id}`}
            onClick={(e) => handleExerciseClick(exercise.id, e)}
            className={`absolute inset-0 transition-all duration-500 transform ${
              index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Image */}
            <img
              src={`/exercises/${exercise.images[0]}`}
              alt={exercise.name}
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {exercise.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exercise.primaryMuscles.map((muscle, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-600/80 text-white text-sm rounded-full"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
                <p className="text-gray-200 line-clamp-2">
                  {exercise.instructions[0]}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredExercises.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCarousel; 
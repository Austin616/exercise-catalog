import React, { useState, useEffect } from 'react';
import ExerciseCard from '../Exercises/components/ExerciseCard';
import ExerciseListItem from '../Exercises/components/ExerciseListItem';
import ViewControls from '../../components/ViewControls';
import exerciseJson from '../../../../backend/dist/exercises.json';

const Favorites = () => {
  const [viewType, setViewType] = React.useState('grid'); // 'grid' or 'list'
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        // Map favorite IDs to full exercise objects
        const favoriteExercises = data.map(fav => 
          exerciseJson.find(ex => ex.id === fav.exercise_id)
        ).filter(Boolean); // Remove any undefined exercises
        setFavorites(favoriteExercises);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          My Favorite Exercises
        </h1>
        <ViewControls viewType={viewType} onViewChange={setViewType} />
      </div>

      {/* No favorites message */}
      {favorites.length === 0 && (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-500">
            Start adding exercises to your favorites by clicking the heart icon on any exercise.
          </p>
        </div>
      )}

      {/* Favorites grid/list */}
      {favorites.length > 0 && (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "flex flex-col gap-4"
        }>
          {favorites.map((exercise) => (
            viewType === 'grid' ? (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ) : (
              <ExerciseListItem key={exercise.id} exercise={exercise} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 
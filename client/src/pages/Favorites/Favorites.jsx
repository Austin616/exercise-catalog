import React, { useState, useEffect } from 'react';
import ExerciseCard from '../Exercises/components/ExerciseCard';
import ExerciseListItem from '../Exercises/components/ExerciseListItem';
import ViewControls from '../../components/ViewControls';
import Pagination from '../../components/Pagination';
import exerciseJson from '../../../../backend/dist/exercises.json';

const Favorites = () => {
  const [viewType, setViewType] = React.useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        const favoriteExercises = data.map(fav => 
          exerciseJson.find(ex => ex.id === fav.exercise_id)
        ).filter(Boolean);
        setFavorites(favoriteExercises);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = favorites.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewType(newViewMode);
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          My Favorite Exercises
        </h1>

        {/* View Controls */}
        <div className="mb-6 w-full flex justify-center">
          <div className="w-full max-w-3xl">
            <ViewControls
              viewMode={viewType}
              onViewModeChange={handleViewModeChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>

        {/* No favorites message */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <p className="text-lg font-medium">No favorites yet</p>
            <p className="text-sm">Start adding exercises by clicking the heart icon!</p>
          </div>
        )}

        {/* Exercises Grid/List */}
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center w-full">
            {currentFavorites.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-2xl mx-auto">
            {currentFavorites.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
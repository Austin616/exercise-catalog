import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ExerciseCard from '../Exercises/components/ExerciseCard';
import ExerciseListItem from '../Exercises/components/ExerciseListItem';
import ViewControls from '../../components/ViewControls';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import exerciseJson from '../../../../backend/dist/exercises.json';

const Favorites = () => {
  const [viewType, setViewType] = React.useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    muscleGroup: 'all',
    force: 'all',
    equipment: 'all',
    level: 'all'
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userRes = await axios.get('https://exercise-catalog.onrender.com/api/current_user', { withCredentials: true });
        if (userRes.data) {
          const response = await axios.get('https://exercise-catalog.onrender.com/api/favorites', { withCredentials: true });
          const data = response.data;
          const favoriteExercises = data
            .map(fav =>
              exerciseJson.find(ex => ex.id === fav.exercise_id)
            )
            .filter(Boolean);
          setFavorites(favoriteExercises);
        } else {
          setNotLoggedIn(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setFavorites([]);
          setNotLoggedIn(true);
        } else {
          console.error('Failed to fetch favorites', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const uniqueMuscleGroups = useMemo(() => {
    const allMuscles = favorites.reduce((acc, ex) => {
      return [...acc, ...ex.primaryMuscles];
    }, []);
    return ['all', ...new Set(allMuscles)];
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    let result = favorites;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(exercise => 
        exercise.name.toLowerCase().includes(searchLower) ||
        exercise.force?.toLowerCase().includes(searchLower) ||
        exercise.equipment?.toLowerCase().includes(searchLower) ||
        exercise.level?.toLowerCase().includes(searchLower) ||
        exercise.category?.toLowerCase().includes(searchLower) ||
        exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchLower))
      );
    }

    if (filters.muscleGroup !== 'all') {
      result = result.filter(exercise => 
        exercise.primaryMuscles.includes(filters.muscleGroup)
      );
    }

    Object.entries(filters).forEach(([category, value]) => {
      if (category !== 'muscleGroup' && value !== 'all') {
        result = result.filter(exercise => exercise[category] === value);
      }
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'force':
          comparison = a.force.localeCompare(b.force);
          break;
        case 'equipment':
          comparison = a.equipment.localeCompare(b.equipment);
          break;
        case 'level':
          comparison = a.level.localeCompare(b.level);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [favorites, searchTerm, filters, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = filteredFavorites.slice(startIndex, endIndex);

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

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
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

  if (notLoggedIn) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
        <p className="text-gray-600 mb-6">You must be logged in to view your favorite exercises.</p>
        <a
          href="https://exercise-catalog.onrender.com/api/auth/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Log In
        </a>
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

        {/* Search Bar */}
        <div className="mb-6 w-full flex justify-center">
          <div className="w-full max-w-3xl">
            <SearchBar 
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
              searchPlaceholder="Search favorites by name, muscle group, equipment..."
              filterOptions={{
                muscleGroup: uniqueMuscleGroups,
                force: ['all', ...new Set(favorites.map(ex => ex.force).filter(Boolean))],
                equipment: ['all', ...new Set(favorites.map(ex => ex.equipment).filter(Boolean))],
                level: ['all', ...new Set(favorites.map(ex => ex.level).filter(Boolean))]
              }}
              sortOptions={[
                { value: 'name', label: 'Name' },
                { value: 'force', label: 'Force Type' },
                { value: 'equipment', label: 'Equipment' },
                { value: 'level', label: 'Level' }
              ]}
            />
          </div>
        </div>

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
        {filteredFavorites.length === 0 && (
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
                viewMode={viewType}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-2xl mx-auto">
            {currentFavorites.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}

        {/* Explore more */}
        <div className="mt-8 text-center">
          <p className="text-lg font-medium text-gray-700">Want to explore more exercises?</p>
          <p className="text-sm text-gray-500">Browse our full exercise library.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={() => window.location.href = '/search'}
          >
            Browse Exercises
          </button>
        </div>
        {/* Pagination */}
        {filteredFavorites.length > 0 && (
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
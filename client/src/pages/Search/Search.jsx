import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import exerciseJson from '../../../../backend/dist/exercises.json';
import ExerciseCard from '../Exercises/components/ExerciseCard';
import ExerciseListItem from '../Exercises/components/ExerciseListItem';
import SearchBar from '../../components/SearchBar';
import ViewControls from '../../components/ViewControls';
import Pagination from '../../components/Pagination';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    muscleGroup: 'all',
    equipment: 'all',
    level: 'all',
    force: 'all'
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Handle initial search query from URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Get unique values for filters
  const uniqueMuscleGroups = useMemo(() => {
    const allMuscles = exerciseJson.reduce((acc, ex) => {
      return [...acc, ...ex.primaryMuscles];
    }, []);
    return ['all', ...new Set(allMuscles)];
  }, []);

  const uniqueEquipment = useMemo(() => {
    const equipment = exerciseJson.map(ex => ex.equipment).filter(Boolean);
    return ['all', ...new Set(equipment)];
  }, []);

  const uniqueLevels = useMemo(() => {
    const levels = exerciseJson.map(ex => ex.level).filter(Boolean);
    return ['all', ...new Set(levels)];
  }, []);

  const uniqueForces = useMemo(() => {
    const forces = exerciseJson.map(ex => ex.force).filter(Boolean);
    return ['all', ...new Set(forces)];
  }, []);

  // Filter and sort exercises
  const filteredExercises = useMemo(() => {
    let result = exerciseJson;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(exercise => 
        exercise.name.toLowerCase().includes(searchLower) ||
        exercise.force?.toLowerCase().includes(searchLower) ||
        exercise.equipment?.toLowerCase().includes(searchLower) ||
        exercise.level?.toLowerCase().includes(searchLower) ||
        exercise.category?.toLowerCase().includes(searchLower) ||
        exercise.primaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply filters
    if (filters.muscleGroup !== 'all') {
      result = result.filter(exercise => 
        exercise.primaryMuscles.includes(filters.muscleGroup)
      );
    }
    if (filters.equipment !== 'all') {
      result = result.filter(exercise => exercise.equipment === filters.equipment);
    }
    if (filters.level !== 'all') {
      result = result.filter(exercise => exercise.level === filters.level);
    }
    if (filters.force !== 'all') {
      result = result.filter(exercise => exercise.force === filters.force);
    }

    // Apply sorting
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
  }, [searchTerm, filters, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExercises = filteredExercises.slice(startIndex, endIndex);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Search Exercises</h1>

        {/* Search Bar */}
        <div className="mb-6 w-full max-w-3xl">
          <SearchBar
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            searchPlaceholder="Search exercises by name, muscle group, equipment..."
            filterOptions={{
              muscleGroup: uniqueMuscleGroups,
              equipment: uniqueEquipment,
              level: uniqueLevels,
              force: uniqueForces
            }}
            sortOptions={[
              { value: 'name', label: 'Name' },
              { value: 'force', label: 'Force Type' },
              { value: 'equipment', label: 'Equipment' },
              { value: 'level', label: 'Level' }
            ]}
          />
        </div>

        {/* View Controls */}
        <div className="mb-6 w-full flex justify-center">
          <div className="w-full max-w-3xl">
            <ViewControls
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>

        {/* No Results Message */}
        {filteredExercises.length === 0 && searchTerm !== '' && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mb-4" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Results Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {currentExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                viewMode={viewMode}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-2xl mx-auto">
            {currentExercises.map((exercise) => (
              <ExerciseListItem
                key={exercise.id}
                exercise={exercise}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredExercises.length > 0 && (
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

export default Search;

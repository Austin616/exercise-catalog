import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import exerciseJson from "../../../../backend/dist/exercises.json";
import ExerciseCard from "./components/ExerciseCard";
import ExerciseListItem from "./components/ExerciseListItem";
import SearchBar from "../../components/SearchBar";
import BackButton from "../../components/BackButton";
import Pagination from '../../components/Pagination';
import ViewControls from '../../components/ViewControls';

const MuscleGroup = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    force: 'all',
    equipment: 'all',
    level: 'all'
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const formattedId = id
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Filter exercises matching the muscle group
  const allExercises = exerciseJson.filter((exercise) =>
    exercise.primaryMuscles.includes(formattedId.toLowerCase()) ||
    exercise.primaryMuscles.includes(formattedId)
  );

  // Get unique values for filters
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

  // Apply search and filters
  const filteredExercises = useMemo(() => {
    let result = allExercises;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(exercise => 
        exercise.name.toLowerCase().includes(searchLower) ||
        exercise.force?.toLowerCase().includes(searchLower) ||
        exercise.equipment?.toLowerCase().includes(searchLower) ||
        exercise.level?.toLowerCase().includes(searchLower) ||
        exercise.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filters
    Object.entries(filters).forEach(([category, value]) => {
      if (value !== 'all') {
        result = result.filter(exercise => exercise[category] === value);
      }
    });

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
  }, [searchTerm, filters, sortBy, sortOrder, allExercises]);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {formattedId} Exercises
        </h1>

        {/* Back Button */}
        <div className="mb-4 w-full flex justify-center">
          <div className="w-full max-w-3xl">
            <BackButton />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 w-full max-w-3xl">
          <SearchBar 
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            searchPlaceholder="Search exercises by name..."
            filterOptions={{
              force: uniqueForces,
              equipment: uniqueEquipment,
              level: uniqueLevels
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

        {/* Exercises Grid/List */}
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

export default MuscleGroup;
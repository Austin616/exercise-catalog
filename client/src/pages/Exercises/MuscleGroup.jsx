import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import exerciseJson from "../../../../backend/dist/exercises.json";
import ExerciseCard from "./components/ExerciseCard";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import BackButton from "../../components/BackButton";

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
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

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

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

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

  return (
    <div className="flex flex-col items-center justify-center mt-10 min-h-screen">
      {/* Back Button */}
      <div className="w-full max-w-7xl px-8 mb-4">
        <BackButton />
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">
        Showing exercises for {formattedId}
      </h1>

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        searchPlaceholder="Search exercises by name..."
        filterOptions={{
          force: ['all', 'pull', 'push', 'static'],
          equipment: ['all', 'body only', 'other', 'machine', 'kettlebells', 'dumbbell', 'cable', 'barbell', 'medicine ball', 'exercise ball', 'e-z curl bar', 'foam roll'],
          level: ['all', 'beginner', 'intermediate', 'expert']
        }}
        sortOptions={[
          { value: 'name', label: 'Name' },
          { value: 'force', label: 'Force Type' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'level', label: 'Level' }
        ]}
      />

      {/* Cards Section */}
      <div className="flex justify-center w-full px-8">
        {currentExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl">
            {currentExercises.map((exercise, index) => (
              <ExerciseCard 
                key={index} 
                exercise={exercise} 
                searchTerm={searchTerm}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xl flex flex-col items-center gap-4">
            {allExercises.length === 0 ? (
              <>
                <span className="text-6xl">😢</span>
                <p>No exercises found for {formattedId}</p>
              </>
            ) : (
              <>
                <span className="text-6xl">🔍</span>
                <p>No exercises match your search criteria</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {currentExercises.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default MuscleGroup;
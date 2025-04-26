import React, { useState, useMemo } from 'react'
import exerciseJson from '../../../../backend/dist/exercises.json'
import MuscleGroupCard from './components/MuscleGroupCard'
import Pagination from '../../components/Pagination'
import SearchBar from '../../components/SearchBar'

const Exercises = () => {
  const allPrimaryMuscles = exerciseJson.flatMap(e => e.primaryMuscles)
  const uniquePrimaryMuscles = [...new Set(allPrimaryMuscles)]

  // Calculate exercise counts for each muscle group
  const muscleGroupCounts = uniquePrimaryMuscles.reduce((acc, muscle) => {
    acc[muscle] = exerciseJson.filter(exercise => 
      exercise.primaryMuscles.includes(muscle)
    ).length
    return acc
  }, {})

  // Find the muscle group with the most exercises
  const maxMuscleGroup = Object.entries(muscleGroupCounts)
    .reduce((max, [muscle, count]) => 
      count > (max.count || 0) ? { muscle, count } : max, 
      { muscle: '', count: 0 }
    ).muscle

  // State for search, filter, and sort
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    force: 'all',
    equipment: 'all',
    level: 'all',
    category: 'all'
  })
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Filter and sort muscle groups
  const filteredMuscles = useMemo(() => {
    let result = uniquePrimaryMuscles;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(muscle => 
        muscle.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filters
    Object.entries(filters).forEach(([category, value]) => {
      if (value !== 'all') {
        result = result.filter(muscle => {
          const exercises = exerciseJson.filter(ex => 
            ex.primaryMuscles.includes(muscle)
          );
          return exercises.some(ex => ex[category] === value);
        });
      }
    });

    // Apply sorting
    result.sort((a, b) => {
      const countA = muscleGroupCounts[a];
      const countB = muscleGroupCounts[b];
      return sortOrder === 'asc' ? countA - countB : countB - countA;
    });

    return result;
  }, [searchTerm, filters, sortOrder, uniquePrimaryMuscles, muscleGroupCounts]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMuscles = filteredMuscles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMuscles.length / itemsPerPage);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <SearchBar
        onSearch={handleSearch}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {currentMuscles.length > 0 ? (
          currentMuscles.map((muscle, i) => (
            <MuscleGroupCard 
              key={i} 
              muscleGroup={muscle} 
              maxMuscleGroup={maxMuscleGroup}
              searchTerm={searchTerm}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-xl flex flex-col items-center gap-4">
            <span className="text-6xl">😢</span>
            <p>No muscle groups found</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => setCurrentPage(page)}
      />
    </div>
  )
}

export default Exercises
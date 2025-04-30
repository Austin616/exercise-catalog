import React, { useState, useMemo } from 'react'
import exerciseJson from '../../../../backend/dist/exercises.json'
import MuscleGroupCard from './components/MuscleGroupCard'
import MuscleGroupListItem from './components/MuscleGroupListItem'
import Pagination from '../../components/Pagination'
import ViewControls from '../../components/ViewControls'

const Exercises = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // Get unique muscle groups
  const muscleGroups = useMemo(() => {
    const allMuscles = exerciseJson.reduce((acc, ex) => {
      return [...acc, ...ex.primaryMuscles]
    }, [])
    return [...new Set(allMuscles)].sort()
  }, [])

  // Calculate exercise counts for each muscle group
  const muscleGroupCounts = useMemo(() => {
    return muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = exerciseJson.filter(exercise => 
        exercise.primaryMuscles.includes(muscle)
      ).length
      return acc
    }, {})
  }, [muscleGroups])

  // Find the muscle group with the most exercises
  const maxMuscleGroup = useMemo(() => {
    return Object.entries(muscleGroupCounts).reduce((max, [muscle, count]) => {
      return count > (muscleGroupCounts[max] || 0) ? muscle : max
    }, '')
  }, [muscleGroupCounts])

  // Pagination calculations
  const totalPages = Math.ceil(muscleGroups.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMuscles = muscleGroups.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Exercises</h1>

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

        {/* Muscle Groups Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl justify-center mx-auto">
            {currentMuscles.map((muscle) => (
              <MuscleGroupCard
                key={muscle}
                muscleGroup={muscle}
                maxMuscleGroup={maxMuscleGroup}
                count={muscleGroupCounts[muscle]}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-2xl mx-auto">
            {currentMuscles.map((muscle) => (
              <MuscleGroupListItem
                key={muscle}
                muscleGroup={muscle}
                count={muscleGroupCounts[muscle]}
                isMostPopular={muscle === maxMuscleGroup}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {muscleGroups.length > 0 && (
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
  )
}

export default Exercises
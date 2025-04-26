import React, { useState } from 'react'
import exerciseJson from '../../../../backend/dist/exercises.json'
import MuscleGroupCard from './components/MuscleGroupCard'
import Pagination from '../../components/Pagination'

const Exercises = () => {
  const allPrimaryMuscles = exerciseJson.flatMap(e => e.primaryMuscles)
  const uniquePrimaryMuscles = [...new Set(allPrimaryMuscles)]

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentMuscles = uniquePrimaryMuscles.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(uniquePrimaryMuscles.length / itemsPerPage)

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {currentMuscles.map((muscle, i) => (
          <MuscleGroupCard key={i} muscleGroup={muscle} />
        ))}
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
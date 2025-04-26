import React, { useState } from "react";
import { useParams } from "react-router-dom";
import exerciseJson from "../../../../backend/dist/exercises.json";
import ExerciseCard from "./components/ExerciseCard";
import Pagination from "../../components/Pagination";

const MuscleGroup = () => {
  const { id } = useParams();

  const formattedId = id
    .replace(/-/g, " ") // Replace hyphens with spaces
    .split(" ")         // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" ");         // Join back together

  // Filter exercises matching the muscle group
  const exercises = exerciseJson.filter((exercise) =>
    exercise.primaryMuscles.includes(formattedId.toLowerCase()) ||
    exercise.primaryMuscles.includes(formattedId)
  );

  // --- Pagination Setup ---
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const totalPages = Math.ceil(exercises.length / exercisesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">
        Showing exercises for {formattedId}
      </h1>

      {/* Cards Section */}
      <div className="flex justify-center w-full px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl">
          {currentExercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MuscleGroup;
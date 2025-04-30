import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tagColors } from "../../../utils/tagColors";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ExerciseListItem = ({ exercise }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    if (exercise) {
      fetchFavoriteStatus();
    }
  }, [exercise]);

  const fetchFavoriteStatus = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/favorites", {
        withCredentials: true,
      });
      const match = res.data.find((fav) => fav.exercise_id === exercise.id);
      if (match) {
        setIsFavorite(true);
        setFavoriteId(match.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        console.error("Failed to fetch favorites", error);
      }
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!exercise) return;

    if (isFavorite) {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/api/favorites/${favoriteId}`,
          { withCredentials: true }
        );
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success("Removed from favorites!", { autoClose: 1000 });
      } catch (error) {
        console.error("Failed to remove favorite", error);
        if (error.response && error.response.status === 401) {
          toast.error("You must be logged in to remove favorites", {
            autoClose: 1000,
          });
        } else {
          toast.error("Failed to remove favorite", { autoClose: 1000 });
        }
      }
    } else {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/api/favorites",
          {
            exercise_id: exercise.id,
            exercise_name: exercise.name,
          },
          { withCredentials: true }
        );
        setIsFavorite(true);
        setFavoriteId(res.data.id);
        toast.success("Added to favorites!", { autoClose: 1000 });
      } catch (error) {
        console.error("Failed to add favorite", error);
        if (error.response && error.response.status === 401) {
          toast.error("You must be logged in to add favorites", {
            autoClose: 1000,
          });
        } else {
          toast.error("Failed to add favorite", { autoClose: 1000 });
        }
      }
    }
  };

  return (
    <Link
      to={`/exercises/instance/${exercise.id}`}
      className="group relative block bg-white rounded-lg shadow p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-blue-300 active:scale-95"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {exercise.name}
        </h3>
        <button
          onClick={handleFavoriteClick}
          className="p-2 rounded-full shadow-lg transition-colors duration-300"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label="Add to favorites"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              isFavorite
                ? "text-red-500 fill-current"
                : "text-gray-400 hover:text-red-500"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center gap-4 pt-4">
        <div className="flex-grow">
          <div className="mt-2 flex flex-wrap gap-2">
            {exercise.primaryMuscles.map((muscle, index) => (
              <span
                key={index}
                className={`px-2 py-1 ${tagColors.category.bg} ${tagColors.category.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.category.hover}`}
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center justify-center flex-wrap gap-2 text-center group">
          {exercise.equipment && (
            <span
              className={`px-2 py-1 ${tagColors.equipment.bg} ${tagColors.equipment.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.equipment.hover}`}
            >
              {exercise.equipment}
            </span>
          )}
          {exercise.level && (
            <span
              className={`px-2 py-1 ${tagColors.level.bg} ${tagColors.level.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.level.hover}`}
            >
              {exercise.level}
            </span>
          )}
          {exercise.force && (
            <span
              className={`px-2 py-1 ${tagColors.force.bg} ${tagColors.force.text} text-xs rounded-full transition group-hover:scale-105 ${tagColors.force.hover}`}
            >
              {exercise.force}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExerciseListItem;

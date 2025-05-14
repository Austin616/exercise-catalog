import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tagColors } from "../../../utils/tagColors";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ExerciseCard = ({ exercise, searchTerm = "" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const highlightText = (text) => {
    if (!text || !searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (!exercise) return null;

  useEffect(() => {
    if (exercise) {
      fetchFavoriteStatus();
    }
  }, [exercise]);

  const fetchFavoriteStatus = async () => {
    try {
      const res = await axios.get("https://exercise-catalog.onrender.com/api/favorites", {
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
        // User is not logged in, silently handle it
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
      }
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!exercise) return;

    if (isFavorite) {
      try {
        await axios.delete(
          `https://exercise-catalog.onrender.com/api/favorites/${favoriteId}`,
          { withCredentials: true }
        );
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success("Removed from favorites!");
      } catch (error) {
        console.error("Failed to remove favorite", error);
        if (error.response && error.response.status === 401) {
          toast.error("You must be logged in to remove favorites");
        }
      }
    } else {
      try {
        const res = await axios.post(
          "https://exercise-catalog.onrender.com/api/favorites",
          {
            exercise_id: exercise.id,
            exercise_name: exercise.name,
          },
          { withCredentials: true }
        );
        setIsFavorite(true);
        setFavoriteId(res.data.id);
        toast.success("Added to favorites!");
      } catch (error) {
        toast.error("Login to add favorites");
      }
    }
  };

  const isTagMatch = (value) => {
    if (!searchTerm) return false;
    return value?.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div className="relative group ">
      {/* Main Card Link */}
      <Link
        to={`/exercises/instance/${exercise.id}`}
        className="group bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 active:scale-95"
      >
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 ${
            isFavorite
              ? "opacity-100 shadow-lg"
              : "opacity-0 group-hover:shadow-lg group-hover:opacity-100 hover:shadow-md"
          }`}
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
        {/* Image */}
        <div className="rounded-full bg-blue-100 p-4 mb-4 flex items-center justify-center">
          <img
            src={`/exercises/${exercise.images?.[0] || "default.jpg"}`}
            alt={exercise.name || "Exercise"}
            className="w-24 h-24 object-cover rounded-full"
          />
        </div>

        {/* Exercise Name */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          {highlightText(exercise.name || "")}
        </h2>

        {/* Primary Muscles */}
        <div className="mb-4">
          {exercise.primaryMuscles?.map((muscle, index) => (
            <span
              key={index}
              className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {highlightText(muscle)}
            </span>
          ))}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
          {exercise.force && (
            <span
              className={`px-3 py-1 rounded-full font-medium capitalize ${
                tagColors.force.bg
              } ${tagColors.force.text} ${tagColors.force.hover} ${
                isTagMatch(exercise.force) ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              {highlightText(exercise.force)}
            </span>
          )}
          {exercise.equipment && (
            <span
              className={`px-3 py-1 rounded-full font-medium capitalize ${
                tagColors.equipment.bg
              } ${tagColors.equipment.text} ${tagColors.equipment.hover} ${
                isTagMatch(exercise.equipment) ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              {highlightText(exercise.equipment)}
            </span>
          )}
          {exercise.level && (
            <span
              className={`px-3 py-1 rounded-full font-medium capitalize ${
                tagColors.level.bg
              } ${tagColors.level.text} ${tagColors.level.hover} ${
                isTagMatch(exercise.level) ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              {highlightText(exercise.level)}
            </span>
          )}
          {exercise.category && (
            <span
              className={`px-3 py-1 rounded-full font-medium capitalize ${
                tagColors.category.bg
              } ${tagColors.category.text} ${tagColors.category.hover} ${
                isTagMatch(exercise.category) ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              {highlightText(exercise.category)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ExerciseCard;

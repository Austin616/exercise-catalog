import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useParams, Link, useNavigate } from "react-router-dom";
import exerciseJson from "../../../../backend/dist/exercises.json";
import BackButton from "../../components/BackButton";
import { tagColors } from "../../utils/tagColors";
import RelatedExercises from "./components/RelatedExercises";
import ExerciseVideo from "./components/ExerciseVideo";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // <-- new
import { subDays, subMonths, isAfter } from 'date-fns';

const ExerciseInstance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = exerciseJson.find(ex => ex.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null); // <-- new: track DB id
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [viewRange, setViewRange] = useState("month");

  useEffect(() => {
    if (exercise) {
      fetchFavoriteStatus();
      fetchExerciseHistory();
    }
  }, [exercise]);

  const fetchFavoriteStatus = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/favorites', { withCredentials: true });
      const match = res.data.find(fav => fav.exercise_id === exercise.id);
      if (match) {
        setIsFavorite(true);
        setFavoriteId(match.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Unauthorized, silently fail
      } else {
        console.error('Failed to fetch favorites', error);
      }
    }
  };

  const fetchExerciseHistory = async () => {
    try {
      const exerciseId = (exerciseJson.find(e => e.name === exercise.name)?.id) || encodeURIComponent(exercise.name);
      const res = await axios.get(`http://127.0.0.1:5000/api/exercise_history/${exerciseId}`, {
        withCredentials: true
      });
      console.log('res.data', res.data);
      setExerciseHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch exercise history", err);
    }
  };

  const handleMuscleClick = (muscle) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/exercises/${muscle.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleFavoriteClick = async () => {
    if (!exercise) return;

    if (isFavorite) {
      // Remove from favorites
      try {
        await axios.delete(`http://127.0.0.1:5000/api/favorites/${favoriteId}`, { withCredentials: true });
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success('Removed from favorites!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized: Please log in to remove favorites.');
        } else {
          console.error('Failed to remove favorite', error);
          toast.error('Failed to remove favorite');
        }
      }
    } else {
      // Add to favorites
      try {
        const res = await axios.post('http://127.0.0.1:5000/api/favorites', {
          exercise_id: exercise.id,
          exercise_name: exercise.name
        }, { withCredentials: true });
        setIsFavorite(true);
        setFavoriteId(res.data.id);
        toast.success('Added to favorites!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized: Please log in to add favorites.');
        } else {
          console.error('Failed to add favorite', error);
          toast.error('Failed to add favorite');
        }
      }
    }
  };

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Exercise not found 😢
        </h1>
      </div>
    );
  }

  const filteredHistory = Object.values(
    exerciseHistory.reduce((acc, entry) => {
      const dateKey = entry.date.split('T')[0];
      const maxWeight = Math.max(...entry.sets.map(set => parseInt(set.weight) || 0));
      if (!acc[dateKey] || acc[dateKey].max < maxWeight) {
        acc[dateKey] = { date: dateKey, max: maxWeight };
      }
      return acc;
    }, {})
  ).filter((entry) => {
    const date = new Date(entry.date);
    const now = new Date();
    if (viewRange === "week") return isAfter(date, subDays(now, 7));
    if (viewRange === "month") return isAfter(date, subMonths(now, 1));
    if (viewRange === "6months") return isAfter(date, subMonths(now, 6));
    return true;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="w-full max-w-7xl px-8 mb-4">
        <BackButton />
      </div>

      {/* Exercise Name and Favorite Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          {exercise.name}
        </h1>
        <button
          onClick={handleFavoriteClick}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Add to favorites"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
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

      {/* Exercise Images */}
      <div className="mb-8 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
        {exercise.images.map((image, index) => (
          <img
            key={index}
            src={`/exercises/${image}`}
            alt={`${exercise.name} - ${index === 0 ? 'Start' : 'End'} Position`}
            className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-200 ${
              activeImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div 
          className="absolute inset-0 cursor-pointer"
          onMouseEnter={() => setActiveImage(1)}
          onMouseLeave={() => setActiveImage(0)}
        >
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black/50 rounded-full px-6 py-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
            Hover to see {activeImage === 0 ? 'end' : 'start'} position
          </div>
        </div>
      </div>

      {/* Exercise Video */}
      <ExerciseVideo exerciseName={exercise.name} />

      {/* Exercise Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {[
          { 
            title: "Equipment", 
            value: exercise.equipment || "No equipment required",
            tagStyle: `${tagColors.equipment.bg} ${tagColors.equipment.text}`
          },
          { 
            title: "Level", 
            value: exercise.level,
            tagStyle: `${tagColors.level.bg} ${tagColors.level.text}`
          },
          { 
            title: "Force", 
            value: exercise.force,
            tagStyle: `${tagColors.force.bg} ${tagColors.force.text}`
          },
          { 
            title: "Category", 
            value: exercise.category,
            tagStyle: `${tagColors.category.bg} ${tagColors.category.text}`
          }
        ].filter(detail => detail.value).map((detail, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-gray-500 text-sm mb-2">{detail.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${detail.tagStyle}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Instructions
        </h2>
        <ol className="list-decimal list-inside space-y-4">
          {exercise.instructions.map((instruction, index) => (
            <li
              key={index}
              className="text-gray-700 pl-2 text-lg leading-relaxed"
            >
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      {/* Muscles */}
      {["Primary", "Secondary"].map((type) => (
        <div
          key={type}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            {type} Muscles
          </h2>
          <div className="flex flex-wrap gap-2">
            {exercise[`${type.toLowerCase()}Muscles`].map((muscle, index) => (
              <Link
                key={index}
                to={`/exercises/${muscle.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleMuscleClick(muscle)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize shadow-sm transition-transform duration-200 hover:scale-105
                  ${type === "Primary" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}`}
              >
                {muscle}
              </Link>
            ))}
          </div>
        </div>
      ))}

            {/* Progress Over Time Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Progress Over Time
        </h2>
        {exerciseHistory.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Start a workout to track progress.
          </p>
        )}
        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium text-gray-600">View:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={viewRange}
            onChange={(e) => setViewRange(e.target.value)}
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="6months">6 Months</option>
          </select>
        </div>
        <div className="overflow-x-auto pb-2">
          <div style={{ minWidth: `${Math.max(filteredHistory.length * 80, 800)}px`, height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredHistory}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      
      </div>

      {/* Related Exercises */}
      <RelatedExercises currentExercise={exercise} />
    </div>
  );
};

export default ExerciseInstance;
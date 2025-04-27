import React, { useState, useEffect } from 'react';

const ExerciseVideo = ({ exerciseName }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Note: In a real application, you would need to:
        // 1. Set up a backend endpoint to handle YouTube API calls
        // 2. Store your YouTube API key securely
        // 3. Implement proper error handling and rate limiting
        
        // For now, we'll use a placeholder video
        setVideoId('dQw4w9WgXcQ'); // Replace with actual video ID from your backend
        setLoading(false);
      } catch (err) {
        setError('Failed to load video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [exerciseName]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="w-64 aspect-square bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        How to Perform
      </h2>
      <div className="w-64 aspect-square">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`${exerciseName} tutorial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default ExerciseVideo; 
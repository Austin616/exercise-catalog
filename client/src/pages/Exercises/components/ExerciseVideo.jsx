import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExerciseVideo = ({ exerciseName }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/youtube/search?query=${exerciseName}`);
        setVideoId(response.data.videoId);
      } catch (err) {
        console.error(err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [exerciseName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2>How to Perform {exerciseName}</h2>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`${exerciseName} tutorial`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-64"
      ></iframe>
    </div>
  );
};

export default ExerciseVideo;

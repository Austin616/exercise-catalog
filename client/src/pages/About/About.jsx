import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Exercise Catalog</h1>
          <p className="text-xl text-gray-600">Your comprehensive guide to fitness and exercise</p>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Exercise Catalog is designed to help fitness enthusiasts, athletes, and beginners alike discover and learn about various exercises. Our goal is to provide a comprehensive, easy-to-use platform that makes fitness knowledge accessible to everyone.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Exercise Library</h3>
              <p className="text-gray-600">
                Browse through a vast collection of exercises organized by muscle groups, equipment, and difficulty levels.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Information</h3>
              <p className="text-gray-600">
                Each exercise comes with comprehensive details including proper form, equipment needed, and muscle groups targeted.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Search & Filter</h3>
              <p className="text-gray-600">
                Easily find the exercises you need with our powerful search and filtering system.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Workout Planning</h3>
              <p className="text-gray-600">
                Create and manage your workout routines with our intuitive workout planning tools.
              </p>
            </div>
          </div>

          {/* New Workout Tracking Section */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Workout Tracking & Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Workout Builder</h3>
              <p className="text-gray-600">
                Create personalized workout routines by selecting exercises from our extensive library. Organize your workouts by muscle groups, days, or training goals.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Log your sets, reps, and weights for each exercise. Track your progress over time with visual charts and statistics to see your improvement.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Workout History</h3>
              <p className="text-gray-600">
                Keep a detailed record of your past workouts. Review your performance, identify patterns, and make informed decisions about your training.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Goal Setting</h3>
              <p className="text-gray-600">
                Set specific fitness goals and track your progress towards achieving them. Whether it's increasing strength, improving endurance, or building muscle, we help you stay on track.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Use</h2>
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              1. Browse exercises by muscle group or use the search function to find specific exercises
            </p>
            <p className="text-gray-600">
              2. Click on any exercise to view detailed information and instructions
            </p>
            <p className="text-gray-600">
              3. Use the filters to narrow down exercises by equipment, difficulty, or other criteria
            </p>
            <p className="text-gray-600">
              4. Create and save your custom workout routines
            </p>
            <p className="text-gray-600">
              5. Track your progress by logging your workouts and monitoring your improvements
            </p>
            <p className="text-gray-600">
              6. Review your workout history and adjust your training plan as needed
            </p>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/exercises"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Exploring Exercises
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Exercise Catalog. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ for fitness enthusiasts everywhere</p>
        </div>
      </div>
    </div>
  );
};

export default About;

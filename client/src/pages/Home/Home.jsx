import React from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import ExerciseCarousel from './ExerciseCarousel';
import AnimatedFeatures from './AnimatedFeatures';
import Testimonials from './Testimonials';
import exerciseJson from '../../../../backend/dist/exercises.json';

const Home = () => {
  // Get unique categories and muscle groups for stats
  const categories = [...new Set(exerciseJson.map(ex => ex.category))];
  const allMuscles = exerciseJson.reduce((acc, ex) => {
    return [...acc, ...ex.primaryMuscles, ...ex.secondaryMuscles];
  }, []);
  const uniqueMuscles = [...new Set(allMuscles)];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-4">
            <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Exercises
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {exerciseJson.length}+
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Exercise Categories
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {categories.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg transform hover:scale-105 transition-transform duration-300">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Targeted Muscles
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {uniqueMuscles.length}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Features */}
      <AnimatedFeatures />

      {/* Featured Exercises Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Exercises
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Explore some of our popular exercises with detailed instructions and proper form guidance.
            </p>
          </div>
          <ExerciseCarousel />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your fitness journey?</span>
            <span className="block text-blue-200">Explore our exercise catalog today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <Link
              to="/exercises"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
            >
              Browse Exercises
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 bg-opacity-60 hover:bg-opacity-70 transform hover:scale-105 transition-all duration-300"
            >
              Search Exercises
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

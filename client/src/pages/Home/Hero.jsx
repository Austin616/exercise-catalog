import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef(null);
  const scrollButtonRef = useRef(null);

  useEffect(() => {
    // Fade in animation for the hero content
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    // Scroll button animation
    const scrollButton = scrollButtonRef.current;
    if (scrollButton) {
      const animateScrollButton = () => {
        scrollButton.classList.add('animate-bounce');
        setTimeout(() => {
          scrollButton.classList.remove('animate-bounce');
        }, 1000);
      };
      setInterval(animateScrollButton, 2000);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div ref={heroRef} className="relative z-10 opacity-0 translate-y-4 transition-all duration-1000 pt-16">
        {/* Logo with animation */}
        <div className="flex items-center justify-center space-x-2 mb-6 transform hover:scale-105 transition-transform duration-300">
          <img src="/image.png" alt="GymAtlas Logo" width={40} className="animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800">GymAtlas</h1>
        </div>
    
        {/* Title with gradient text */}
        <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Welcome to GymAtlas
        </h1>
    
        {/* Subtitle with icons */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600">Your ultimate destination</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-xl text-gray-600">for exercise information</p>
          </div>
        </div>
    
        {/* Button with hover animation */}
        <Link
          to="/exercises"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>Explore Exercises</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* Scroll down button */}
      <button
        ref={scrollButtonRef}
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300"
        aria-label="Scroll down"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>
  );
};

export default Hero;

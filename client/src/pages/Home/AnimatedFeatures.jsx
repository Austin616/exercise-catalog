import React, { useEffect, useRef, useState } from 'react';

const features = [
  {
    title: "Smart Exercise Search",
    description: "Find the perfect exercises for your workout with our intelligent search and filter system.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Visual Guides",
    description: "High-quality images and step-by-step instructions ensure proper form and technique.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Muscle Targeting",
    description: "Understand which muscles each exercise targets for better workout planning.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: "Progress Tracking",
    description: "Keep track of your exercises and monitor your fitness journey over time.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const TypeWriter = ({ text, delay = 50, className }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && currentIndex < text.length) {
        // Typing
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else if (isDeleting && currentIndex > 0) {
        // Deleting
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      } else if (currentIndex === text.length) {
        // Start deleting after a pause
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (currentIndex === 0) {
        // Start typing again after a pause
        setTimeout(() => setIsDeleting(false), 1000);
      }
    }, isDeleting ? delay / 2 : delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, delay, text, isDeleting]);

  return <span className={className}>{displayText}</span>;
};

const AnimatedFeatures = () => {
  const featuresRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      featuresRef.current.forEach((feature, index) => {
        if (feature) {
          setTimeout(() => {
            feature.classList.add('opacity-100', 'translate-y-0', 'rotate-0', 'scale-100');
            feature.classList.remove('opacity-0', 'translate-y-8', 'rotate-3', 'scale-95');
          }, 200 * index); // Staggered animation
        }
      });
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center overflow-hidden">
          {isVisible && (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
                <TypeWriter 
                  text="Powerful Features for Your Fitness Journey"
                  delay={50}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                />
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                <TypeWriter 
                  text="Everything you need to plan, track, and perfect your workouts."
                  delay={30}
                />
              </p>
            </>
          )}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featuresRef.current[index] = el)}
              className="relative p-6 bg-white rounded-xl border border-gray-100 shadow-sm transform opacity-0 translate-y-8 rotate-3 scale-95 transition-all duration-700 ease-out hover:shadow-lg hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center mb-4 transform hover:rotate-12 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedFeatures; 
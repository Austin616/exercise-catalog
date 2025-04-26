import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `
      relative 
      transition-all 
      duration-300 
      hover:text-blue-400 
      hover:scale-105
      ${isActive ? "text-blue-400 font-bold" : ""}
      after:content-[''] 
      after:absolute 
      after:left-0 
      after:-bottom-1 
      after:w-0 
      after:h-0.75 
      after:bg-blue-400 
      after:transition-all 
      after:duration-300 
      hover:after:w-full
    `;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="py-4 px-8 flex items-center bg-gray-800 text-white relative">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        <Link
          to="/"
          className="font-bold flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300"
        >
          <img src="/image.png" alt="GymAtlas Logo" width={40} />
          <span>GymAtlas</span>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
        <Link to="/" className={getLinkClass("/")}>
          Home
        </Link>
        <Link to="/exercises" className={getLinkClass("/exercises")}>
          Exercises
        </Link>
        <Link to="/about" className={getLinkClass("/about")}>
          About
        </Link>
      </div>
      {/* Right side (Search Bar + Profile) */}
      <div className="hidden md:flex items-center space-x-4 ml-auto">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search..."
            className="px-2 py-2 bg-transparent text-white focus:outline-none"
          />
          <button className="p-4 bg-gray-600 hover:bg-gray-500 transition duration-300 cursor-pointer">
            <FaSearch className="text-white" />
          </button>
        </div>

        {/* Profile Button */}
        <Link
          to="/profile"
          className="flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-2"
        >
          <FaUser className="text-white" size={25} />
        </Link>
      </div>

      {/* Hamburger Button (Mobile Only) */}
      <div className="md:hidden ml-auto">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none cursor-pointer"
        >
          {isOpen ? (
            <span className="text-2xl">&times;</span>
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-4 transform transition-all duration-300 ease-in-out
  ${
    isOpen
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-4 pointer-events-none"
  }`}
      >
        <Link
          to="/"
          className={getLinkClass("/")}
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/exercises"
          className={getLinkClass("/exercises")}
          onClick={() => setIsOpen(false)}
        >
          Exercises
        </Link>
        <Link
          to="/about"
          className={getLinkClass("/about")}
          onClick={() => setIsOpen(false)}
        >
          About
        </Link>
        <Link
          to="/search"
          className={getLinkClass("/search")}
          onClick={() => setIsOpen(false)}
        >
          Search
        </Link>
        <Link
          to="/profile"
          className={getLinkClass("/profile")}
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-4">
          <FaUser className="text-white" size={15} />
          <span className="ml-2">Profile</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

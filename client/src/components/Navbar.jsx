import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaHeart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://exercise-catalog.onrender.com/api/current_user', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user', error);
        setUser(null);
      }
    };

    fetchUser();

    const handleScroll = () => {
      // Only hide during hero section on home page
      if (location.pathname === '/') {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        // Show navbar after hero section (100vh)
        setIsVisible(scrollPosition > viewportHeight - 100);
      } else {
        // Always show navbar on other pages
        setIsVisible(true);
      }
    };

    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogin = () => {
    window.location.href = 'https://exercise-catalog.onrender.com/api/auth/login';
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-8 flex items-center bg-gray-800 text-white transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        <Link
          to="/"
          className="font-bold flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300"
          onClick={handleNavClick}
        >
          <img src="/image.png" alt="GymAtlas Logo" width={40} />
          <span>GymAtlas</span>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
        <Link to="/" className={getLinkClass("/")} onClick={handleNavClick}>
          Home
        </Link>
        <Link to="/exercises" className={getLinkClass("/exercises")} onClick={handleNavClick}>
          Categories
        </Link>
        <Link to="/search" className={getLinkClass("/search")} onClick={handleNavClick}>
          Browse
        </Link>
        <Link to="/create" className={getLinkClass("/create")} onClick={handleNavClick}>
          Create
        </Link>
        <Link to="/about" className={getLinkClass("/about")} onClick={handleNavClick}>
          About
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4 ml-auto">
        {/* Favorites Button */}
        <Link
          to="/favorites"
          className={`flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-2 ${location.pathname === '/favorites' ? 'ring-2 ring-red-500' : ''}`}
          onClick={handleNavClick}
        >
          <FaHeart className={`${location.pathname === '/favorites' ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors duration-300`} size={25} />
        </Link>

        {/* Profile Button */}
        {user ? (
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-2"
          >
            <FaUser className="text-white" size={25} />
            <span className="ml-2">Logout</span>
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-2"
          >
            <FaUser className="text-white" size={25} />
            <span className="ml-2">Login</span>
          </button>
        )}
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
          ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <Link
          to="/"
          className={getLinkClass("/")}
          onClick={handleNavClick}
        >
          Home
        </Link>
        <Link
          to="/exercises"
          className={getLinkClass("/exercises")}
          onClick={handleNavClick}
        >
          Categories
        </Link>
        <Link
          to="/about"
          className={getLinkClass("/about")}
          onClick={handleNavClick}
        >
          About
        </Link>
        <Link
          to="/search"
          className={getLinkClass("/search")}
          onClick={handleNavClick}
        >
          Browse
        </Link>

        {/* Mobile Icons */}
        <div className="flex space-x-4">
          <Link
            to="/favorites"
            className={`flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-4 ${location.pathname === '/favorites' ? 'ring-2 ring-red-500' : ''}`}
            onClick={handleNavClick}
          >
            <FaHeart className={`${location.pathname === '/favorites' ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors duration-300`} size={15} />
            <span className="ml-2">Favorites</span>
          </Link>
          {user ? (
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-4"
            >
              <FaUser className="text-white" size={15} />
              <span className="ml-2">Logout</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center bg-gray-700 hover:bg-gray-600 transition-colors duration-300 rounded-full p-4"
            >
              <FaUser className="text-white" size={15} />
              <span className="ml-2">Login</span>
            </button>
          )}
        </div>
      </div>
      <Dialog
  open={showLogoutDialog}
  onClose={() => setShowLogoutDialog(false)}
  PaperProps={{
    style: {
      borderRadius: '12px',
      padding: '24px',
      minWidth: '320px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    },
  }}
>
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
    Confirm Logout
  </DialogTitle>
  <DialogContent sx={{ textAlign: 'center', mb: 2 }}>
    <p style={{ fontSize: '1.1rem', marginTop: '8px' }}>Are you sure you want to log out?</p>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
    <Button
      variant="outlined"
      color="primary"
      onClick={() => setShowLogoutDialog(false)}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        window.location.href = 'https://exercise-catalog.onrender.com/api/auth/logout';
      }}
    >
      Log Out
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default Navbar;

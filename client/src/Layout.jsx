import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        const scrollPosition = window.scrollY;
        const viewportHeight = window.innerHeight;
        // Show navbar after passing hero (around 100vh)
        setIsNavbarVisible(scrollPosition > viewportHeight - 100);
      } else {
        // Always show navbar on other pages
        setIsNavbarVisible(true);
      }
    };

    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <div className={`${isNavbarVisible ? 'pt-24' : 'pt-0'}`}>
      {children}
    </div>
  );
};

export default Layout;

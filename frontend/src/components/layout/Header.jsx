import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Menu, Luggage } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import UserProfile from '../auth/UserProfile';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentSection, setCurrentSection] = useState('home');

  // Update current section based on hash and scroll to top
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setCurrentSection(hash || 'home');
      
      // Scroll to top when navigating to a new section
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    handleHashChange(); // Initial load
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogoClick = () => {
    window.location.hash = '#home';
    // Scroll to top when clicking logo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.header 
      className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-blue-500 p-2 rounded-lg">
              <Luggage className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Travel<span className="text-blue-500">Lite</span>
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className={`relative transition-colors font-medium ${
                currentSection === 'home'
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              Home
              {currentSection === 'home' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
              )}
            </a>
            <a 
              href="#booking" 
              className={`relative transition-colors font-medium ${
                currentSection === 'booking'
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              Book Now
              {currentSection === 'booking' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
              )}
            </a>
            <button 
              onClick={() => {
                window.location.hash = '#services';
                // Scroll to top when clicking Services
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth'
                });
              }}
              className={`relative transition-colors font-medium ${
                currentSection === 'services'
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              Services
              {currentSection === 'services' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
              )}
            </button>
            <a 
              href="#counter" 
              className={`relative transition-colors font-medium ${
                currentSection === 'counter'
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300'
              }`}
            >
              Staff Portal
              {currentSection === 'counter' && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400 rounded-full"></div>
              )}
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>

            {/* Authentication Section */}
            {!loading && (
              <div className="hidden md:flex items-center space-x-3">
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setAuthMode('login');
                        setAuthModalOpen(true);
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      Login
                    </button>
                    <motion.button 
                      onClick={() => {
                        setAuthMode('register');
                        setAuthModalOpen(true);
                      }}
                      className="border-2 border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white dark:hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.button>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthMode('login'); // Reset to default mode
        }}
        defaultMode={authMode}
      />
    </motion.header>
  );
};

export default Header;

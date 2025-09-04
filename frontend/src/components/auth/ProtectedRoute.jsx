import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, fallback = null, requireAuth = true }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center p-4"
        >
          <div className="text-center space-y-6 max-w-md">
            <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Authentication Required
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please sign in to access this page.
              </p>
            </div>
            <button className="btn-primary">
              Sign In
            </button>
          </div>
        </motion.div>
      )
    );
  }

  // Check if user should not be authenticated (e.g., login page when already logged in)
  if (!requireAuth && isAuthenticated) {
    return (
      fallback || (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center p-4"
        >
          <div className="text-center space-y-6 max-w-md">
            <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You are already signed in.
              </p>
            </div>
            <button className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      )
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;

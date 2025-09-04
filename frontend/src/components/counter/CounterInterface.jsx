import { useState, useEffect } from 'react';
import StaffLogin from './StaffLogin';
import CounterDashboard from './CounterDashboard';
import { counterService } from '../../services/counterService';

const CounterInterface = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffData, setStaffData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const session = counterService.getStaffSession();
        if (session && session.token && session.staff) {
          setStaffData(session);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking staff session:', error);
        counterService.clearStaffSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleLoginSuccess = (loginData) => {
    setStaffData(loginData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setStaffData(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !staffData) {
    return <StaffLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <CounterDashboard staffData={staffData} onLogout={handleLogout} />;
};

export default CounterInterface;

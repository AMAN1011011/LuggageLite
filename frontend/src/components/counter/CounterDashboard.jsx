import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Truck, 
  CheckCircle, 
  Users, 
  Clock, 
  Search,
  LogOut,
  RefreshCw,
  AlertTriangle,
  User
} from 'lucide-react';
import { counterService } from '../../services/counterService';
import LuggageAcceptanceModal from './LuggageAcceptanceModal';

const CounterDashboard = ({ staffData, onLogout }) => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchBookingId, setSearchBookingId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [acceptanceModal, setAcceptanceModal] = useState({ isOpen: false, booking: null, operationType: null });

  const { staff, token } = staffData;

  // Load dashboard stats
  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await counterService.getDashboardStats(token);
      if (response.success) {
        setDashboardStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Search for booking
  const handleBookingSearch = async (e) => {
    e.preventDefault();
    if (!searchBookingId.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const response = await counterService.lookupBooking(token, searchBookingId.trim());
      if (response.success) {
        setSearchResult(response.data);
      } else {
        throw new Error(response.message || 'Booking not found');
      }
    } catch (error) {
      console.error('Error searching booking:', error);
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await counterService.staffLogout(token);
      counterService.clearStaffSession();
      onLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear session and logout even if API call fails
      counterService.clearStaffSession();
      onLogout();
    }
  };

  // Load stats on component mount
  useEffect(() => {
    loadDashboardStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardStats, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  if (isLoading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  if (error && !dashboardStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadDashboardStats}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    TravelLite Counter
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {staff.assignedStation.name} • {staff.displayRole}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{staff.fullName}</span>
              </div>
              
              <button
                onClick={loadDashboardStats}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Today's Pickups"
              value={dashboardStats.todayStats.pickups}
              icon={Package}
              color="blue"
              description="Luggage to collect"
            />
            <StatCard
              title="Today's Deliveries"
              value={dashboardStats.todayStats.deliveries}
              icon={Truck}
              color="orange"
              description="Luggage to deliver"
            />
            <StatCard
              title="Completed Today"
              value={dashboardStats.todayStats.completed}
              icon={CheckCircle}
              color="green"
              description="Successfully processed"
            />
            <StatCard
              title="Staff On Duty"
              value={dashboardStats.stationInfo.staffOnDuty}
              icon={Users}
              color="purple"
              description="At this station"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Booking Lookup
            </h2>
            
            <form onSubmit={handleBookingSearch} className="space-y-4">
              <div>
                <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booking ID
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="bookingId"
                    value={searchBookingId}
                    onChange={(e) => setSearchBookingId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter booking ID (e.g., TL12345678AB)"
                  />
                  <button
                    type="submit"
                    disabled={isSearching || !searchBookingId.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                  >
                    {isSearching ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Search Error */}
              {searchError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{searchError}</p>
                </div>
              )}

              {/* Search Result */}
              {searchResult && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-green-900 dark:text-green-100">
                      Booking Found
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      searchResult.operationType === 'pickup' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                    }`}>
                      {counterService.getOperationTypeInfo(searchResult.operationType).title}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                      <span className="text-gray-900 dark:text-white">
                        {searchResult.booking.userId.firstName} {searchResult.booking.userId.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="text-gray-900 dark:text-white">
                        {searchResult.booking.userId.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Route:</span>
                      <span className="text-gray-900 dark:text-white">
                        {searchResult.booking.sourceStation.name} → {searchResult.booking.destinationStation.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-medium ${
                        counterService.getBookingStatusInfo(searchResult.booking.status).color === 'green' ? 'text-green-600' :
                        counterService.getBookingStatusInfo(searchResult.booking.status).color === 'blue' ? 'text-blue-600' :
                        counterService.getBookingStatusInfo(searchResult.booking.status).color === 'orange' ? 'text-orange-600' :
                        'text-gray-600'
                      }`}>
                        {counterService.getBookingStatusInfo(searchResult.booking.status).label}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {searchResult.operationType === 'pickup' && searchResult.booking.status === 'payment_confirmed' && (
                    <button
                      onClick={() => openAcceptanceModal(searchResult.booking, searchResult.operationType)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Accept Luggage
                    </button>
                  )}
                </div>
              )}
            </form>
          </motion.div>

          {/* Pending Work */}
          {dashboardStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Pending Work
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Pickups Pending</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Ready for collection</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {dashboardStats.pendingWork.pickups}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">Deliveries Pending</p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">Ready for delivery</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {dashboardStats.pendingWork.deliveries}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Personal Stats */}
        {dashboardStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Personal Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.personalStats.totalBookingsProcessed}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.personalStats.totalLuggageAccepted}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Luggage Accepted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.personalStats.averageProcessingTime}m
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Processing</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStats.personalStats.customerRating}⭐
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Luggage Acceptance Modal */}
      <LuggageAcceptanceModal
        booking={acceptanceModal.booking}
        operationType={acceptanceModal.operationType}
        isOpen={acceptanceModal.isOpen}
        onClose={closeAcceptanceModal}
        onSuccess={handleAcceptanceSuccess}
        staffToken={token}
      />
    </div>
  );

  // Modal handlers
  const openAcceptanceModal = (booking, operationType) => {
    setAcceptanceModal({
      isOpen: true,
      booking,
      operationType
    });
  };

  const closeAcceptanceModal = () => {
    setAcceptanceModal({
      isOpen: false,
      booking: null,
      operationType: null
    });
  };

  const handleAcceptanceSuccess = (result) => {
    // Refresh dashboard stats
    loadDashboardStats();
    
    // Clear search result if it was the accepted booking
    if (searchResult && searchResult.booking.bookingId === result.booking.bookingId) {
      setSearchResult(null);
      setSearchBookingId('');
    }
    
    // Show success message (could be replaced with a toast notification)
    console.log('✅ Luggage accepted successfully:', result);
  };
};

export default CounterDashboard;

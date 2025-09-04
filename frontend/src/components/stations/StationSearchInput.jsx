import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Train, Plane, X, Loader, Navigation } from 'lucide-react';
import useStationSearch from '../../hooks/useStationSearch';

const StationSearchInput = ({
  placeholder = "Search stations...",
  onStationSelect,
  selectedStation = null,
  type = null, // 'railway', 'airport', or null for both
  className = "",
  showTypeFilter = true,
  showNearbyButton = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(type);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const {
    query,
    results,
    loading,
    error,
    popularStations,
    updateQuery,
    clearSearch,
    findNearbyStations,
    hasResults,
    hasPopular
  } = useStationSearch();

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur (with delay to allow selection)
  const handleBlur = (e) => {
    // Don't close if clicking on dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return;
    }
    setTimeout(() => setIsOpen(false), 150);
  };

  // Handle station selection
  const handleStationSelect = (station) => {
    onStationSelect?.(station);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle clear selection
  const handleClear = () => {
    onStationSelect?.(null);
    clearSearch();
    inputRef.current?.focus();
  };

  // Handle type filter change
  const handleTypeChange = (newType) => {
    setSelectedType(newType);
    if (query) {
      updateQuery(query, { type: newType });
    }
  };

  // Handle nearby stations
  const handleFindNearby = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const nearbyStations = await findNearbyStations(latitude, longitude, {
            type: selectedType,
            limit: 10,
            maxDistance: 50000 // 50km
          });
          
          // Show nearby stations in dropdown
          setIsOpen(true);
          inputRef.current?.focus();
        } catch (error) {
          console.error('Error finding nearby stations:', error);
          alert('Failed to find nearby stations. Please try again.');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please search manually.');
      }
    );
  };

  // Get stations to display (search results or popular)
  const stationsToShow = hasResults ? results : (hasPopular ? popularStations.slice(0, 8) : []);
  
  // Filter by type if selected
  const filteredStations = selectedType 
    ? stationsToShow.filter(station => station.type === selectedType)
    : stationsToShow;

  return (
    <div className={`relative ${className}`}>
      {/* Type Filter */}
      {showTypeFilter && (
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => handleTypeChange(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedType === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTypeChange('railway')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
              selectedType === 'railway'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Train className="h-3 w-3" />
            <span>Railway</span>
          </button>
          <button
            onClick={() => handleTypeChange('airport')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
              selectedType === 'airport'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Plane className="h-3 w-3" />
            <span>Airport</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {loading ? (
              <Loader className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={selectedStation ? selectedStation.displayWithType || selectedStation.name : query}
            onChange={(e) => updateQuery(e.target.value, { type: selectedType })}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={selectedStation ? selectedStation.displayWithType : placeholder}
            className="input-field pl-10 pr-20"
            disabled={!!selectedStation}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
            {showNearbyButton && !selectedStation && (
              <button
                onClick={handleFindNearby}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Find nearby stations"
              >
                <Navigation className="h-4 w-4" />
              </button>
            )}
            
            {selectedStation && (
              <button
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && !selectedStation && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
            >
              {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 border-b border-gray-200 dark:border-gray-700">
                  {error}
                </div>
              )}

              {!hasResults && !loading && query.length >= 2 && (
                <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No stations found for "{query}"
                </div>
              )}

              {!hasResults && !query && hasPopular && (
                <div className="p-3 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  Popular Stations
                </div>
              )}

              {filteredStations.map((station, index) => (
                <motion.button
                  key={station.id || station._id || `station-${index}`}
                  onClick={() => handleStationSelect(station)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      station.type === 'railway' 
                        ? 'bg-blue-100 dark:bg-blue-900/20' 
                        : 'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      {station.type === 'railway' ? (
                        <Train className={`h-4 w-4 ${
                          station.type === 'railway' ? 'text-blue-600 dark:text-blue-400' : ''
                        }`} />
                      ) : (
                        <Plane className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {station.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{station.city}, {station.state}</span>
                        </span>
                        <span>•</span>
                        <span className="uppercase font-mono">{station.code}</span>
                      </div>
                    </div>

                    {station.distance && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {station.distance}km away
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}

              {loading && (
                <div className="p-4 text-center">
                  <Loader className="h-5 w-5 animate-spin text-blue-500 mx-auto" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StationSearchInput;

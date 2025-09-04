import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpDown, MapPin, Clock, AlertCircle, CheckCircle, Calculator } from 'lucide-react';
import StationSearchInput from './StationSearchInput';
import useStationSearch from '../../hooks/useStationSearch';

const StationSelector = ({ onSelectionChange, className = "" }) => {
  const [sourceStation, setSourceStation] = useState(null);
  const [destinationStation, setDestinationStation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { calculateDistance } = useStationSearch();

  // Calculate distance when both stations are selected
  useEffect(() => {
    const sourceId = sourceStation?.id || sourceStation?._id;
    const destId = destinationStation?.id || destinationStation?._id;
    if (sourceStation && destinationStation && sourceId !== destId) {
      calculateStationDistance();
    } else {
      setDistance(null);
    }
  }, [sourceStation, destinationStation]);

  // Notify parent of selection changes
  useEffect(() => {
    const sourceId = sourceStation?.id || sourceStation?._id;
    const destId = destinationStation?.id || destinationStation?._id;
    const isValid = sourceStation && destinationStation && sourceId !== destId;
    onSelectionChange?.({
      sourceStation,
      destinationStation,
      distance,
      isValid,
      errors: validationErrors
    });
  }, [sourceStation, destinationStation, distance, validationErrors, onSelectionChange]);

  const calculateStationDistance = async () => {
    setCalculatingDistance(true);
    try {
      const sourceId = sourceStation?.id || sourceStation?._id;
      const destId = destinationStation?.id || destinationStation?._id;
      
      if (sourceId && destId) {
        const result = await calculateDistance(sourceId, destId);
        setDistance(result);
        setValidationErrors({});
      } else {
        setDistance(null);
        setValidationErrors({});
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
      setValidationErrors({});
      setDistance(null);
    } finally {
      setCalculatingDistance(false);
    }
  };

  const handleSourceSelect = (station) => {
    setSourceStation(station);
    
    // Clear validation errors
    const newErrors = { ...validationErrors };
    delete newErrors.source;
    delete newErrors.same;
    setValidationErrors(newErrors);

    // Check if same as destination
    if (station && destinationStation && (station.id === destinationStation.id || station._id === destinationStation._id)) {
      setValidationErrors(prev => ({
        ...prev,
        same: 'Source and destination stations cannot be the same'
      }));
    }
  };

  const handleDestinationSelect = (station) => {
    setDestinationStation(station);
    
    // Clear validation errors
    const newErrors = { ...validationErrors };
    delete newErrors.destination;
    delete newErrors.same;
    setValidationErrors(newErrors);

    // Check if same as source
    if (station && sourceStation && (station.id === sourceStation.id || station._id === sourceStation._id)) {
      setValidationErrors(prev => ({
        ...prev,
        same: 'Source and destination stations cannot be the same'
      }));
    }
  };

  const handleSwapStations = () => {
    const temp = sourceStation;
    setSourceStation(destinationStation);
    setDestinationStation(temp);
  };

  const validateSelection = () => {
    const errors = {};
    
    if (!sourceStation) {
      errors.source = 'Please select a source station';
    }
    
    if (!destinationStation) {
      errors.destination = 'Please select a destination station';
    }
    
    const sourceId = sourceStation?.id || sourceStation?._id;
    const destId = destinationStation?.id || destinationStation?._id;
    if (sourceStation && destinationStation && sourceId === destId) {
      errors.same = 'Source and destination stations cannot be the same';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sourceId = sourceStation?.id || sourceStation?._id;
  const destId = destinationStation?.id || destinationStation?._id;
  const isValid = sourceStation && destinationStation && sourceId !== destId;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Select Your Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose your source and destination stations for luggage transportation
        </p>
      </div>

      {/* Station Selection */}
      <div className="space-y-4">
        {/* Source Station */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="inline h-4 w-4 mr-1" />
            Source Station (Departure)
          </label>
          <StationSearchInput
            placeholder="Search departure station..."
            onStationSelect={handleSourceSelect}
            selectedStation={sourceStation}
            showTypeFilter={true}
            showNearbyButton={true}
          />
          {validationErrors.source && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{validationErrors.source}</span>
            </p>
          )}
        </div>

        {/* Swap Button */}
        {(sourceStation || destinationStation) && (
          <div className="flex justify-center">
            <motion.button
              onClick={handleSwapStations}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Swap stations"
            >
              <ArrowUpDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        )}

        {/* Destination Station */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="inline h-4 w-4 mr-1" />
            Destination Station (Arrival)
          </label>
          <StationSearchInput
            placeholder="Search arrival station..."
            onStationSelect={handleDestinationSelect}
            selectedStation={destinationStation}
            showTypeFilter={true}
            showNearbyButton={true}
          />
          {validationErrors.destination && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{validationErrors.destination}</span>
            </p>
          )}
        </div>

        {/* Same Station Error */}
        {validationErrors.same && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{validationErrors.same}</span>
            </p>
          </div>
        )}
      </div>

      {/* Journey Summary */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Journey Selected</span>
          </div>

          <div className="space-y-2">
            {/* Route */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {sourceStation.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {sourceStation.city}, {sourceStation.state}
                </div>
              </div>
              
              <ArrowRight className="h-5 w-5 text-gray-400" />
              
              <div className="flex-1 text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {destinationStation.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {destinationStation.city}, {destinationStation.state}
                </div>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-green-200 dark:border-green-800">
              {calculatingDistance ? (
                <>
                  <Calculator className="h-4 w-4 animate-spin" />
                  <span>Calculating distance...</span>
                </>
              ) : distance ? (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>Distance: {distance.distance} km</span>
                </>
              ) : null}
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-green-200 dark:border-green-800 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-medium">Source Service:</span>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {sourceStation.services?.operatingHours?.start || '06:00'} - {sourceStation.services?.operatingHours?.end || '22:00'}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-medium">Destination Service:</span>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {destinationStation.services?.operatingHours?.start || '06:00'} - {destinationStation.services?.operatingHours?.end || '22:00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StationSelector;

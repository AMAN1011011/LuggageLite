import { useState, useEffect, useCallback } from 'react';

const useStationSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popularStations, setPopularStations] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Search stations function
  const searchStations = useCallback(async (searchQuery, options = {}) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        limit: options.limit || 10,
        activeOnly: options.activeOnly !== false
      });

      if (options.type) {
        params.append('type', options.type);
      }

      if (options.state) {
        params.append('state', options.state);
      }

      const response = await fetch(`${API_BASE_URL}/stations/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.data.stations);
      } else {
        setError(data.message || 'Failed to search stations');
        setResults([]);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setResults([]);
      console.error('Station search error:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery, options) => {
      searchStations(searchQuery, options);
    }, 300),
    [searchStations]
  );

  // Get popular stations
  const fetchPopularStations = useCallback(async (options = {}) => {
    try {
      const params = new URLSearchParams({
        limit: options.limit || 20
      });

      if (options.type) {
        params.append('type', options.type);
      }

      if (options.state) {
        params.append('state', options.state);
      }

      const response = await fetch(`${API_BASE_URL}/stations/popular?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPopularStations(data.data.stations);
      }
    } catch (err) {
      console.error('Error fetching popular stations:', err);
    }
  }, [API_BASE_URL]);

  // Get station by ID
  const getStationById = useCallback(async (stationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stations/${stationId}`);
      const data = await response.json();

      if (response.ok) {
        return data.data.station;
      } else {
        throw new Error(data.message || 'Station not found');
      }
    } catch (err) {
      console.error('Error fetching station:', err);
      throw err;
    }
  }, [API_BASE_URL]);

  // Calculate distance between stations
  const calculateDistance = useCallback(async (sourceId, destinationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stations/distance/${sourceId}/${destinationId}`);
      const data = await response.json();

      if (response.ok) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to calculate distance');
      }
    } catch (err) {
      console.error('Error calculating distance:', err);
      throw err;
    }
  }, [API_BASE_URL]);

  // Find nearby stations
  const findNearbyStations = useCallback(async (latitude, longitude, options = {}) => {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        maxDistance: options.maxDistance || 100000,
        limit: options.limit || 10
      });

      if (options.type) {
        params.append('type', options.type);
      }

      const response = await fetch(`${API_BASE_URL}/stations/nearby?${params}`);
      const data = await response.json();

      if (response.ok) {
        return data.data.stations;
      } else {
        throw new Error(data.message || 'Failed to find nearby stations');
      }
    } catch (err) {
      console.error('Error finding nearby stations:', err);
      throw err;
    }
  }, [API_BASE_URL]);

  // Update query and trigger search
  const updateQuery = useCallback((newQuery, options = {}) => {
    setQuery(newQuery);
    if (newQuery.trim().length >= 2) {
      debouncedSearch(newQuery, options);
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  // Load popular stations on mount
  useEffect(() => {
    fetchPopularStations();
  }, [fetchPopularStations]);

  return {
    // State
    query,
    results,
    loading,
    error,
    popularStations,
    
    // Actions
    updateQuery,
    clearSearch,
    searchStations,
    fetchPopularStations,
    getStationById,
    calculateDistance,
    findNearbyStations,
    
    // Utilities
    hasResults: results.length > 0,
    hasPopular: popularStations.length > 0
  };
};

export default useStationSearch;

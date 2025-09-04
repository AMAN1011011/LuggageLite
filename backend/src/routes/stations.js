const express = require('express');
const router = express.Router();
const {
  searchStations,
  getPopularStations,
  getStation,
  findNearbyStations,
  calculateDistanceBetweenStations,
  getStatesWithStations,
  seedStations
} = require('../controllers/stationController');

// Input validation middleware
const validateSearchQuery = (req, res, next) => {
  const { q: query } = req.query;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query parameter "q" is required'
    });
  }
  
  if (query.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters long'
    });
  }
  
  next();
};

const validateCoordinates = (req, res, next) => {
  const { latitude, longitude } = req.query;
  
  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }
  
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid latitude or longitude format'
    });
  }
  
  if (lat < -90 || lat > 90) {
    return res.status(400).json({
      success: false,
      message: 'Latitude must be between -90 and 90'
    });
  }
  
  if (lng < -180 || lng > 180) {
    return res.status(400).json({
      success: false,
      message: 'Longitude must be between -180 and 180'
    });
  }
  
  next();
};

const validateStationId = (req, res, next) => {
  const { identifier } = req.params;
  
  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: 'Station identifier is required'
    });
  }
  
  // Check if it's a valid ObjectId or station code
  if (!identifier.match(/^[0-9a-fA-F]{24}$/) && identifier.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Invalid station identifier format'
    });
  }
  
  next();
};

const validateDistanceCalculation = (req, res, next) => {
  const { sourceId, destinationId } = req.params;
  
  if (!sourceId || !destinationId) {
    return res.status(400).json({
      success: false,
      message: 'Both source and destination station IDs are required'
    });
  }
  
  if (!sourceId.match(/^[0-9a-fA-F]{24}$/) || !destinationId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid station ID format'
    });
  }
  
  if (sourceId === destinationId) {
    return res.status(400).json({
      success: false,
      message: 'Source and destination stations cannot be the same'
    });
  }
  
  next();
};

// Public routes
router.get('/search', validateSearchQuery, searchStations);
router.get('/popular', getPopularStations);
router.get('/nearby', validateCoordinates, findNearbyStations);
router.get('/states', getStatesWithStations);
router.get('/distance/:sourceId/:destinationId', validateDistanceCalculation, calculateDistanceBetweenStations);
router.get('/:identifier', validateStationId, getStation);

// Development/Admin routes
router.post('/seed', seedStations); // Remove in production

module.exports = router;

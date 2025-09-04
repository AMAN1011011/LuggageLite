const Station = require('../models/Station');

/**
 * Search stations by query
 */
const searchStations = async (req, res) => {
  try {
    const { 
      q: query, 
      type, 
      state, 
      limit = 10,
      activeOnly = true 
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchOptions = {
      type: type || null,
      limit: Math.min(parseInt(limit), 50), // Max 50 results
      state: state || null,
      activeOnly: activeOnly === 'true'
    };

    const stations = await Station.searchStations(query.trim(), searchOptions);

    res.status(200).json({
      success: true,
      data: {
        stations,
        query: query.trim(),
        count: stations.length,
        filters: {
          type: searchOptions.type,
          state: searchOptions.state,
          activeOnly: searchOptions.activeOnly
        }
      }
    });

  } catch (error) {
    console.error('Station search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during station search'
    });
  }
};

/**
 * Get popular stations
 */
const getPopularStations = async (req, res) => {
  try {
    const { 
      type, 
      state, 
      limit = 20 
    } = req.query;

    const options = {
      type: type || null,
      state: state || null,
      limit: Math.min(parseInt(limit), 50)
    };

    const stations = await Station.getPopularStations(options);

    res.status(200).json({
      success: true,
      data: {
        stations,
        count: stations.length,
        filters: {
          type: options.type,
          state: options.state
        }
      }
    });

  } catch (error) {
    console.error('Get popular stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching popular stations'
    });
  }
};

/**
 * Get station by ID or code
 */
const getStation = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by code
    let station = null;
    
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId
      station = await Station.findById(identifier);
    } else {
      // Try to find by code
      station = await Station.findOne({ 
        code: identifier.toUpperCase(),
        isActive: true 
      });
    }

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        station
      }
    });

  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching station'
    });
  }
};

/**
 * Find nearby stations
 */
const findNearbyStations = async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      maxDistance = 100000, // 100km default
      type,
      limit = 10 
    } = req.query;

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
        message: 'Invalid latitude or longitude'
      });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90, longitude between -180 and 180'
      });
    }

    const options = {
      type: type || null,
      limit: Math.min(parseInt(limit), 50),
      activeOnly: true
    };

    const stations = await Station.findNearby(
      lat, 
      lng, 
      parseInt(maxDistance), 
      options
    );

    // Calculate distances for each station
    const stationsWithDistance = stations.map(station => {
      const stationObj = station.toObject();
      const distance = calculateDistance(
        lat, lng,
        station.coordinates.latitude,
        station.coordinates.longitude
      );
      return {
        ...stationObj,
        distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
      };
    });

    res.status(200).json({
      success: true,
      data: {
        stations: stationsWithDistance,
        count: stations.length,
        center: { latitude: lat, longitude: lng },
        maxDistance: parseInt(maxDistance),
        filters: {
          type: options.type
        }
      }
    });

  } catch (error) {
    console.error('Find nearby stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while finding nearby stations'
    });
  }
};

/**
 * Calculate distance between two stations
 */
const calculateDistanceBetweenStations = async (req, res) => {
  try {
    const { sourceId, destinationId } = req.params;

    // Find both stations
    const [sourceStation, destinationStation] = await Promise.all([
      Station.findById(sourceId),
      Station.findById(destinationId)
    ]);

    if (!sourceStation) {
      return res.status(404).json({
        success: false,
        message: 'Source station not found'
      });
    }

    if (!destinationStation) {
      return res.status(404).json({
        success: false,
        message: 'Destination station not found'
      });
    }

    const distance = sourceStation.distanceTo(destinationStation);

    res.status(200).json({
      success: true,
      data: {
        sourceStation: {
          id: sourceStation._id,
          name: sourceStation.name,
          code: sourceStation.code,
          city: sourceStation.city,
          state: sourceStation.state
        },
        destinationStation: {
          id: destinationStation._id,
          name: destinationStation.name,
          code: destinationStation.code,
          city: destinationStation.city,
          state: destinationStation.state
        },
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        unit: 'kilometers'
      }
    });

  } catch (error) {
    console.error('Calculate distance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while calculating distance'
    });
  }
};

/**
 * Get all states with station counts
 */
const getStatesWithStations = async (req, res) => {
  try {
    const { type } = req.query;

    const matchQuery = {
      isActive: true,
      isOperational: true
    };

    if (type) {
      matchQuery.type = type;
    }

    const stateStats = await Station.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 },
          railways: {
            $sum: {
              $cond: [{ $eq: ['$type', 'railway'] }, 1, 0]
            }
          },
          airports: {
            $sum: {
              $cond: [{ $eq: ['$type', 'airport'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        states: stateStats.map(state => ({
          name: state._id,
          totalStations: state.count,
          railways: state.railways,
          airports: state.airports
        })),
        count: stateStats.length
      }
    });

  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching states'
    });
  }
};

/**
 * Seed stations (for development/testing)
 */
const seedStations = async (req, res) => {
  try {
    const { seedStations: seedFunction } = require('../utils/seedStations');
    
    const result = await seedFunction();
    
    res.status(200).json({
      success: true,
      message: 'Stations seeded successfully',
      data: result
    });

  } catch (error) {
    console.error('Seed stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while seeding stations'
    });
  }
};

// Utility function to calculate distance between coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = {
  searchStations,
  getPopularStations,
  getStation,
  findNearbyStations,
  calculateDistanceBetweenStations,
  getStatesWithStations,
  seedStations
};

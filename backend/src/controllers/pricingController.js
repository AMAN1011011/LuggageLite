const pricingCalculator = require('../utils/pricingCalculator');
const Station = require('../models/Station');

/**
 * Calculate price for luggage transportation between two stations
 */
const calculatePrice = async (req, res) => {
  try {
    const {
      sourceStationId,
      destinationStationId,
      pickupTime,
      userType = 'new',
      bookingCount = 0
    } = req.body;

    // Validate required fields
    if (!sourceStationId || !destinationStationId) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination station IDs are required'
      });
    }

    // Prevent same source and destination
    if (sourceStationId === destinationStationId) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination stations cannot be the same'
      });
    }

    // Fetch station details
    const [sourceStation, destinationStation] = await Promise.all([
      Station.findById(sourceStationId),
      Station.findById(destinationStationId)
    ]);

    if (!sourceStation || !destinationStation) {
      return res.status(404).json({
        success: false,
        message: 'One or both stations not found'
      });
    }

    // Calculate distance between stations
    const distance = calculateDistanceBetweenCoordinates(
      sourceStation.coordinates.latitude,
      sourceStation.coordinates.longitude,
      destinationStation.coordinates.latitude,
      destinationStation.coordinates.longitude
    );

    // Prepare pricing parameters
    const pricingParams = {
      distance,
      sourceType: sourceStation.type,
      destinationType: destinationStation.type,
      pickupTime: pickupTime ? new Date(pickupTime) : new Date(),
      userType,
      bookingCount: parseInt(bookingCount) || 0
    };

    // Calculate detailed pricing
    const pricingBreakdown = pricingCalculator.calculatePrice(pricingParams);

    // Add station information to response
    const response = {
      success: true,
      data: {
        pricing: pricingBreakdown,
        route: {
          source: {
            id: sourceStation._id,
            name: sourceStation.name,
            code: sourceStation.code,
            type: sourceStation.type,
            city: sourceStation.city,
            state: sourceStation.state,
            coordinates: sourceStation.coordinates
          },
          destination: {
            id: destinationStation._id,
            name: destinationStation.name,
            code: destinationStation.code,
            type: destinationStation.type,
            city: destinationStation.city,
            state: destinationStation.state,
            coordinates: destinationStation.coordinates
          },
          distance: Math.round(distance * 100) / 100,
          estimatedTravelTime: calculateEstimatedTravelTime(distance, sourceStation.type, destinationStation.type)
        }
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Price calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate pricing',
      error: error.message
    });
  }
};

/**
 * Get quick price quote for distance estimation
 */
const getQuickQuote = async (req, res) => {
  try {
    const { distance, sourceType = 'railway', destinationType = 'railway' } = req.query;

    if (!distance || isNaN(distance) || distance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid distance is required'
      });
    }

    const quote = pricingCalculator.getQuickQuote(
      parseFloat(distance),
      sourceType,
      destinationType
    );

    res.json({
      success: true,
      data: quote
    });

  } catch (error) {
    console.error('Quick quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quick quote',
      error: error.message
    });
  }
};

/**
 * Get pricing tier information
 */
const getPricingTiers = async (req, res) => {
  try {
    const { distance } = req.query;

    if (distance && (!isNaN(distance) && distance > 0)) {
      // Get specific tier for distance
      const tier = pricingCalculator.getPricingTier(parseFloat(distance));
      return res.json({
        success: true,
        data: { tier }
      });
    }

    // Return all tiers
    const allTiers = [
      { name: 'Local', minDistance: 0, maxDistance: 50, multiplier: 1.0 },
      { name: 'Regional', minDistance: 51, maxDistance: 200, multiplier: 1.1 },
      { name: 'Interstate', minDistance: 201, maxDistance: 500, multiplier: 1.2 },
      { name: 'Long Distance', minDistance: 501, maxDistance: 'No limit', multiplier: 1.3 }
    ];

    res.json({
      success: true,
      data: { tiers: allTiers }
    });

  } catch (error) {
    console.error('Pricing tiers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing tiers',
      error: error.message
    });
  }
};

/**
 * Get current pricing configuration
 */
const getPricingConfig = async (req, res) => {
  try {
    // In a real implementation, this would fetch from database
    const config = {
      basePrice: 50,
      pricePerKm: 2.5,
      minimumCharge: 100,
      maximumCharge: 2000,
      currency: 'INR',
      stationMultipliers: {
        'railway-railway': 1.0,
        'railway-airport': 1.2,
        'airport-railway': 1.2,
        'airport-airport': 1.4
      },
      serviceFees: {
        handlingFee: 25,
        insuranceFee: 15,
        packagingFee: 20,
        trackingFee: 10
      },
      taxes: {
        gst: 18, // percentage
        serviceTax: 5 // percentage
      },
      discounts: {
        newUser: 10, // percentage
        returning: 5, // percentage
        premium: 15 // percentage
      }
    };

    res.json({
      success: true,
      data: { config }
    });

  } catch (error) {
    console.error('Pricing config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pricing configuration',
      error: error.message
    });
  }
};

// Helper function to calculate distance between coordinates
function calculateDistanceBetweenCoordinates(lat1, lng1, lat2, lng2) {
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

// Helper function to estimate travel time
function calculateEstimatedTravelTime(distance, sourceType, destinationType) {
  // Base speeds in km/h
  const speeds = {
    'railway-railway': 60,  // Train to train
    'railway-airport': 50,  // Train to airport (includes transfer time)
    'airport-railway': 50,  // Airport to train (includes transfer time)
    'airport-airport': 80   // Airport to airport (flight)
  };

  const key = `${sourceType}-${destinationType}`;
  const speed = speeds[key] || 50;
  const timeInHours = distance / speed;
  
  // Add buffer time for handling and processing
  const bufferHours = sourceType === 'airport' || destinationType === 'airport' ? 2 : 1;
  const totalHours = timeInHours + bufferHours;

  return {
    estimatedHours: Math.round(totalHours * 100) / 100,
    estimatedMinutes: Math.round(totalHours * 60),
    breakdown: {
      transportTime: Math.round(timeInHours * 100) / 100,
      processingTime: bufferHours
    }
  };
}

module.exports = {
  calculatePrice,
  getQuickQuote,
  getPricingTiers,
  getPricingConfig
};

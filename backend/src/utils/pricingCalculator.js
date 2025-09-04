/**
 * TravelLite Pricing Calculator
 * Handles dynamic pricing calculation based on distance, station types, and various factors
 */

class PricingCalculator {
  constructor() {
    // Default pricing configuration
    this.defaultConfig = {
      basePrice: 50, // Base price in INR
      pricePerKm: 2.5, // Price per kilometer in INR
      minimumCharge: 100, // Minimum charge regardless of distance
      maximumCharge: 2000, // Maximum charge cap
      
      // Station type multipliers
      stationMultipliers: {
        'railway-railway': 1.0,
        'railway-airport': 1.2,
        'airport-railway': 1.2,
        'airport-airport': 1.4
      },
      
      // Distance-based surcharges
      distanceSurcharges: [
        { minDistance: 0, maxDistance: 50, multiplier: 1.0, name: 'Local' },
        { minDistance: 51, maxDistance: 200, multiplier: 1.1, name: 'Regional' },
        { minDistance: 201, maxDistance: 500, multiplier: 1.2, name: 'Interstate' },
        { minDistance: 501, maxDistance: Infinity, multiplier: 1.3, name: 'Long Distance' }
      ],
      
      // Time-based surcharges (24-hour format)
      timeSurcharges: [
        { startHour: 22, endHour: 6, multiplier: 1.15, name: 'Night Service' },
        { startHour: 6, endHour: 10, multiplier: 1.05, name: 'Morning Rush' },
        { startHour: 17, endHour: 21, multiplier: 1.05, name: 'Evening Rush' }
      ],
      
      // Service fees
      serviceFees: {
        handlingFee: 25,
        insuranceFee: 15,
        packagingFee: 20,
        trackingFee: 10
      },
      
      // Taxes
      taxes: {
        gst: 0.18, // 18% GST
        serviceTax: 0.05 // 5% Service Tax
      }
    };
  }

  /**
   * Calculate total price for luggage transportation
   * @param {Object} params - Calculation parameters
   * @param {number} params.distance - Distance in kilometers
   * @param {string} params.sourceType - Source station type ('railway' or 'airport')
   * @param {string} params.destinationType - Destination station type ('railway' or 'airport')
   * @param {Date} params.pickupTime - Pickup time (optional)
   * @param {string} params.userType - User type ('new', 'returning', 'premium')
   * @param {number} params.bookingCount - User's total booking count
   * @param {Object} params.customConfig - Custom pricing configuration (optional)
   * @returns {Object} Detailed pricing breakdown
   */
  calculatePrice(params) {
    const {
      distance,
      sourceType = 'railway',
      destinationType = 'railway',
      pickupTime = new Date(),
      userType = 'new',
      bookingCount = 0,
      customConfig = {}
    } = params;

    // Merge custom config with default
    const config = { ...this.defaultConfig, ...customConfig };
    
    // Validate inputs
    if (!distance || distance <= 0) {
      throw new Error('Distance must be greater than 0');
    }

    const breakdown = {
      distance: Math.round(distance * 100) / 100,
      sourceType,
      destinationType,
      pickupTime: pickupTime.toISOString(),
      calculations: {},
      fees: {},
      taxes: {},
      discounts: {},
      total: 0
    };

    // 1. Base calculation
    const basePrice = config.basePrice;
    const distancePrice = distance * config.pricePerKm;
    const subtotal = basePrice + distancePrice;
    
    breakdown.calculations.basePrice = basePrice;
    breakdown.calculations.distancePrice = Math.round(distancePrice * 100) / 100;
    breakdown.calculations.subtotal = Math.round(subtotal * 100) / 100;

    // 2. Station type multiplier
    const stationKey = `${sourceType}-${destinationType}`;
    const stationMultiplier = config.stationMultipliers[stationKey] || 1.0;
    const stationAdjustedPrice = subtotal * stationMultiplier;
    
    breakdown.calculations.stationMultiplier = stationMultiplier;
    breakdown.calculations.stationAdjustedPrice = Math.round(stationAdjustedPrice * 100) / 100;

    // 3. Distance-based surcharge
    const distanceSurcharge = config.distanceSurcharges.find(
      s => distance >= s.minDistance && distance <= s.maxDistance
    ) || config.distanceSurcharges[0];
    
    const distanceAdjustedPrice = stationAdjustedPrice * distanceSurcharge.multiplier;
    
    breakdown.calculations.distanceSurcharge = {
      category: distanceSurcharge.name,
      multiplier: distanceSurcharge.multiplier,
      adjustedPrice: Math.round(distanceAdjustedPrice * 100) / 100
    };

    // 4. Time-based surcharge
    const hour = pickupTime.getHours();
    const timeSurcharge = config.timeSurcharges.find(t => {
      if (t.startHour > t.endHour) {
        // Overnight period (e.g., 22:00 to 06:00)
        return hour >= t.startHour || hour < t.endHour;
      } else {
        // Same day period
        return hour >= t.startHour && hour < t.endHour;
      }
    });

    let timeAdjustedPrice = distanceAdjustedPrice;
    if (timeSurcharge) {
      timeAdjustedPrice = distanceAdjustedPrice * timeSurcharge.multiplier;
      breakdown.calculations.timeSurcharge = {
        category: timeSurcharge.name,
        multiplier: timeSurcharge.multiplier,
        adjustedPrice: Math.round(timeAdjustedPrice * 100) / 100
      };
    }

    // 5. Service fees
    let totalFees = 0;
    Object.entries(config.serviceFees).forEach(([feeType, amount]) => {
      breakdown.fees[feeType] = amount;
      totalFees += amount;
    });
    breakdown.fees.total = totalFees;

    // 6. Calculate pre-tax total
    const preTaxTotal = timeAdjustedPrice + totalFees;
    breakdown.calculations.preTaxTotal = Math.round(preTaxTotal * 100) / 100;

    // 7. Apply discounts
    let discountAmount = 0;
    
    // New user discount
    if (userType === 'new') {
      discountAmount += preTaxTotal * 0.1; // 10% discount for new users
      breakdown.discounts.newUserDiscount = {
        percentage: 10,
        amount: Math.round(preTaxTotal * 0.1 * 100) / 100
      };
    }
    
    // Returning user discount
    if (userType === 'returning' && bookingCount >= 5) {
      discountAmount += preTaxTotal * 0.05; // 5% discount for returning users
      breakdown.discounts.loyaltyDiscount = {
        percentage: 5,
        amount: Math.round(preTaxTotal * 0.05 * 100) / 100
      };
    }
    
    // Premium user discount
    if (userType === 'premium') {
      discountAmount += preTaxTotal * 0.15; // 15% discount for premium users
      breakdown.discounts.premiumDiscount = {
        percentage: 15,
        amount: Math.round(preTaxTotal * 0.15 * 100) / 100
      };
    }

    breakdown.discounts.total = Math.round(discountAmount * 100) / 100;
    const discountedTotal = preTaxTotal - discountAmount;
    breakdown.calculations.discountedTotal = Math.round(discountedTotal * 100) / 100;

    // 8. Calculate taxes
    const gstAmount = discountedTotal * config.taxes.gst;
    const serviceTaxAmount = discountedTotal * config.taxes.serviceTax;
    const totalTaxes = gstAmount + serviceTaxAmount;
    
    breakdown.taxes.gst = {
      percentage: config.taxes.gst * 100,
      amount: Math.round(gstAmount * 100) / 100
    };
    breakdown.taxes.serviceTax = {
      percentage: config.taxes.serviceTax * 100,
      amount: Math.round(serviceTaxAmount * 100) / 100
    };
    breakdown.taxes.total = Math.round(totalTaxes * 100) / 100;

    // 9. Final total
    let finalTotal = discountedTotal + totalTaxes;
    
    // Apply minimum and maximum charge limits
    if (finalTotal < config.minimumCharge) {
      finalTotal = config.minimumCharge;
      breakdown.calculations.minimumChargeApplied = true;
    }
    
    if (finalTotal > config.maximumCharge) {
      finalTotal = config.maximumCharge;
      breakdown.calculations.maximumChargeApplied = true;
    }
    
    breakdown.total = Math.round(finalTotal * 100) / 100;

    // 10. Add summary
    breakdown.summary = {
      baseAmount: Math.round(subtotal * 100) / 100,
      surcharges: Math.round((timeAdjustedPrice - subtotal) * 100) / 100,
      fees: totalFees,
      discounts: breakdown.discounts.total,
      taxes: breakdown.taxes.total,
      finalAmount: breakdown.total
    };

    return breakdown;
  }

  /**
   * Get simplified price quote (for quick display)
   * @param {number} distance - Distance in kilometers
   * @param {string} sourceType - Source station type
   * @param {string} destinationType - Destination station type
   * @returns {Object} Simplified pricing info
   */
  getQuickQuote(distance, sourceType = 'railway', destinationType = 'railway') {
    try {
      const fullBreakdown = this.calculatePrice({
        distance,
        sourceType,
        destinationType
      });

      return {
        distance: fullBreakdown.distance,
        estimatedPrice: fullBreakdown.total,
        priceRange: {
          min: Math.round(fullBreakdown.total * 0.9 * 100) / 100,
          max: Math.round(fullBreakdown.total * 1.1 * 100) / 100
        },
        currency: 'INR'
      };
    } catch (error) {
      throw new Error(`Failed to calculate quick quote: ${error.message}`);
    }
  }

  /**
   * Get pricing tier information based on distance
   * @param {number} distance - Distance in kilometers
   * @returns {Object} Pricing tier info
   */
  getPricingTier(distance) {
    const tier = this.defaultConfig.distanceSurcharges.find(
      s => distance >= s.minDistance && distance <= s.maxDistance
    ) || this.defaultConfig.distanceSurcharges[0];

    return {
      name: tier.name,
      multiplier: tier.multiplier,
      distanceRange: {
        min: tier.minDistance,
        max: tier.maxDistance === Infinity ? 'No limit' : tier.maxDistance
      }
    };
  }
}

module.exports = new PricingCalculator();

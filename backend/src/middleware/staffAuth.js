const Staff = require('../models/Staff');

const staffAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Extract staff ID from token (mock implementation)
    // In a real implementation, you would verify JWT token
    const tokenParts = token.split('_');
    if (tokenParts.length < 4 || tokenParts[0] !== 'staff' || tokenParts[1] !== 'token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const staffId = tokenParts[2];
    
    // Find staff member
    const staff = await Staff.findById(staffId);
    
    if (!staff || !staff.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive staff account'
      });
    }

    // Update last activity
    await staff.updateActivity();
    
    // Add staff info to request
    req.staff = staff;
    next();
  } catch (error) {
    console.error('Staff authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid token'
    });
  }
};

module.exports = staffAuthMiddleware;

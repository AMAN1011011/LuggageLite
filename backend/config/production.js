module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: 'production',

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/travellite_prod',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
    issuer: 'travellite-api',
    audience: 'travellite-app'
  },

  // CORS Configuration
  cors: {
    origin: [
      'https://travellite.com',
      'https://www.travellite.com',
      'https://app.travellite.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Security Configuration
  security: {
    bcryptRounds: 12,
    sessionSecret: process.env.SESSION_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY
  },

  // File Upload Configuration
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    destination: 'uploads/',
    limits: {
      files: 4,
      fileSize: 10 * 1024 * 1024
    }
  },

  // Email Configuration
  email: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY,
    from: {
      email: 'noreply@travellite.com',
      name: 'TravelLite'
    },
    templates: {
      welcome: 'd-123456789',
      booking_confirmation: 'd-987654321',
      booking_update: 'd-456789123',
      password_reset: 'd-789123456'
    }
  },

  // SMS Configuration
  sms: {
    provider: 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER
  },

  // Payment Configuration
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    }
  },

  // Cloud Storage Configuration
  storage: {
    provider: 'cloudinary',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      uploadPreset: 'travellite_uploads'
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET
    }
  },

  // Redis Configuration (for caching and sessions)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB || 0,
    ttl: 86400 // 24 hours
  },

  // Logging Configuration
  logging: {
    level: 'info',
    file: {
      enabled: true,
      filename: 'logs/travellite-api.log',
      maxFiles: 5,
      maxSize: '10m'
    },
    console: {
      enabled: false // Disable console logging in production
    }
  },

  // Monitoring and Analytics
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: 'production'
    },
    newRelic: {
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
      appName: 'TravelLite API'
    }
  },

  // API Configuration
  api: {
    version: 'v1',
    timeout: 30000,
    maxRequestSize: '50mb',
    pagination: {
      defaultLimit: 20,
      maxLimit: 100
    }
  },

  // External Services
  services: {
    googleMaps: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY
    },
    railwayApi: {
      baseUrl: 'https://api.railwayapi.com',
      apiKey: process.env.RAILWAY_API_KEY
    },
    airportApi: {
      baseUrl: 'https://api.aviationapi.com',
      apiKey: process.env.AIRPORT_API_KEY
    }
  },

  // Cache Configuration
  cache: {
    ttl: {
      stations: 3600, // 1 hour
      pricing: 1800, // 30 minutes
      user: 300, // 5 minutes
      general: 600 // 10 minutes
    }
  },

  // Backup Configuration
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: 30, // Keep 30 days
    s3Bucket: process.env.BACKUP_S3_BUCKET
  },

  // Feature Flags
  features: {
    enableBookingCancellation: true,
    enableRealTimeTracking: true,
    enableMultiplePaymentMethods: true,
    enableSMSNotifications: true,
    enableEmailNotifications: true,
    enablePushNotifications: false,
    enableLoyaltyProgram: false,
    enableReferralProgram: false
  }
};

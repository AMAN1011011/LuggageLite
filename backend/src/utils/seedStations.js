const Station = require('../models/Station');

// Major Indian Railway Stations
const railwayStations = [
  // Mumbai
  {
    name: "Mumbai Central",
    code: "MMCT",
    type: "railway",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: { latitude: 18.9690, longitude: 72.8205 },
    zone: "Western Railway",
    railwayInfo: {
      division: "Mumbai",
      zone: "Western Railway",
      platforms: 7,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 1, Near Enquiry Counter",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 95
  },
  {
    name: "Chhatrapati Shivaji Maharaj Terminus",
    code: "CSMT",
    type: "railway",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: { latitude: 18.9401, longitude: 72.8352 },
    zone: "Central Railway",
    railwayInfo: {
      division: "Mumbai",
      zone: "Central Railway",
      platforms: 18,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Main Hall, Near Booking Office",
      operatingHours: { start: "04:30", end: "23:30" }
    },
    popularity: 98
  },
  
  // Delhi
  {
    name: "New Delhi Railway Station",
    code: "NDLS",
    type: "railway",
    city: "New Delhi",
    state: "Delhi",
    coordinates: { latitude: 28.6434, longitude: 77.2197 },
    zone: "Northern Railway",
    railwayInfo: {
      division: "Delhi",
      zone: "Northern Railway",
      platforms: 16,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 1, Main Entrance",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 100
  },
  {
    name: "Old Delhi Railway Station",
    code: "DLI",
    type: "railway",
    city: "Delhi",
    state: "Delhi",
    coordinates: { latitude: 28.6618, longitude: 77.2273 },
    zone: "Northern Railway",
    railwayInfo: {
      division: "Delhi",
      zone: "Northern Railway",
      platforms: 16,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 6, Near Waiting Hall",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 90
  },
  
  // Bangalore
  {
    name: "Bangalore City Railway Station",
    code: "SBC",
    type: "railway",
    city: "Bangalore",
    state: "Karnataka",
    coordinates: { latitude: 12.9762, longitude: 77.5993 },
    zone: "South Western Railway",
    railwayInfo: {
      division: "Bangalore",
      zone: "South Western Railway",
      platforms: 10,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 1, Main Building",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 85
  },
  
  // Chennai
  {
    name: "Chennai Central",
    code: "MAS",
    type: "railway",
    city: "Chennai",
    state: "Tamil Nadu",
    coordinates: { latitude: 13.0836, longitude: 80.2751 },
    zone: "Southern Railway",
    railwayInfo: {
      division: "Chennai",
      zone: "Southern Railway",
      platforms: 12,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 9, Near Parcel Office",
      operatingHours: { start: "04:30", end: "23:30" }
    },
    popularity: 88
  },
  
  // Kolkata
  {
    name: "Howrah Junction",
    code: "HWH",
    type: "railway",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: { latitude: 22.5835, longitude: 88.3460 },
    zone: "Eastern Railway",
    railwayInfo: {
      division: "Howrah",
      zone: "Eastern Railway",
      platforms: 23,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 14, Near Inquiry Counter",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 92
  },
  {
    name: "Sealdah Railway Station",
    code: "SDAH",
    type: "railway",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: { latitude: 22.5693, longitude: 88.3694 },
    zone: "Eastern Railway",
    railwayInfo: {
      division: "Sealdah",
      zone: "Eastern Railway",
      platforms: 20,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 9B, Main Building",
      operatingHours: { start: "04:30", end: "23:30" }
    },
    popularity: 80
  },
  
  // Pune
  {
    name: "Pune Junction",
    code: "PUNE",
    type: "railway",
    city: "Pune",
    state: "Maharashtra",
    coordinates: { latitude: 18.5289, longitude: 73.8742 },
    zone: "Central Railway",
    railwayInfo: {
      division: "Pune",
      zone: "Central Railway",
      platforms: 6,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 1, Main Entrance",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 75
  },
  
  // Hyderabad
  {
    name: "Hyderabad Deccan",
    code: "HYB",
    type: "railway",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: { latitude: 17.3753, longitude: 78.4744 },
    zone: "South Central Railway",
    railwayInfo: {
      division: "Hyderabad",
      zone: "South Central Railway",
      platforms: 8,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 1, Near Booking Counter",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 78
  },
  
  // Ahmedabad
  {
    name: "Ahmedabad Junction",
    code: "ADI",
    type: "railway",
    city: "Ahmedabad",
    state: "Gujarat",
    coordinates: { latitude: 23.0216, longitude: 72.5797 },
    zone: "Western Railway",
    railwayInfo: {
      division: "Ahmedabad",
      zone: "Western Railway",
      platforms: 12,
      majorStation: true
    },
    services: {
      luggageService: true,
      counterLocation: "Platform 1, Main Building",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 70
  }
];

// Major Indian Airports
const airports = [
  // Mumbai
  {
    name: "Chhatrapati Shivaji Maharaj International Airport",
    code: "BOM",
    type: "airport",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: { latitude: 19.0896, longitude: 72.8656 },
    airportInfo: {
      iataCode: "BOM",
      icaoCode: "VABB",
      terminals: 2,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal 2, Departure Level 4",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 95
  },
  
  // Delhi
  {
    name: "Indira Gandhi International Airport",
    code: "DEL",
    type: "airport",
    city: "New Delhi",
    state: "Delhi",
    coordinates: { latitude: 28.5562, longitude: 77.1000 },
    airportInfo: {
      iataCode: "DEL",
      icaoCode: "VIDP",
      terminals: 3,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal 3, Level 2, Check-in Area",
      operatingHours: { start: "03:00", end: "24:00" }
    },
    popularity: 100
  },
  
  // Bangalore
  {
    name: "Kempegowda International Airport",
    code: "BLR",
    type: "airport",
    city: "Bangalore",
    state: "Karnataka",
    coordinates: { latitude: 13.1986, longitude: 77.7066 },
    airportInfo: {
      iataCode: "BLR",
      icaoCode: "VOBL",
      terminals: 2,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal 1, Level 3, Departure",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 88
  },
  
  // Chennai
  {
    name: "Chennai International Airport",
    code: "MAA",
    type: "airport",
    city: "Chennai",
    state: "Tamil Nadu",
    coordinates: { latitude: 12.9941, longitude: 80.1709 },
    airportInfo: {
      iataCode: "MAA",
      icaoCode: "VOMM",
      terminals: 4,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal 1, Departure Level",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 85
  },
  
  // Kolkata
  {
    name: "Netaji Subhash Chandra Bose International Airport",
    code: "CCU",
    type: "airport",
    city: "Kolkata",
    state: "West Bengal",
    coordinates: { latitude: 22.6546, longitude: 88.4467 },
    airportInfo: {
      iataCode: "CCU",
      icaoCode: "VECC",
      terminals: 2,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal 1, Level 2, Check-in",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 80
  },
  
  // Hyderabad
  {
    name: "Rajiv Gandhi International Airport",
    code: "HYD",
    type: "airport",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: { latitude: 17.2313, longitude: 78.4298 },
    airportInfo: {
      iataCode: "HYD",
      icaoCode: "VOHS",
      terminals: 1,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal, Level 3, Departure",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 82
  },
  
  // Pune
  {
    name: "Pune Airport",
    code: "PNQ",
    type: "airport",
    city: "Pune",
    state: "Maharashtra",
    coordinates: { latitude: 18.5821, longitude: 73.9197 },
    airportInfo: {
      iataCode: "PNQ",
      icaoCode: "VAPO",
      terminals: 1,
      international: false
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal, Departure Level",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 65
  },
  
  // Ahmedabad
  {
    name: "Sardar Vallabhbhai Patel International Airport",
    code: "AMD",
    type: "airport",
    city: "Ahmedabad",
    state: "Gujarat",
    coordinates: { latitude: 23.0776, longitude: 72.6347 },
    airportInfo: {
      iataCode: "AMD",
      icaoCode: "VAAH",
      terminals: 1,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal, Level 2, Departure",
      operatingHours: { start: "04:30", end: "23:30" }
    },
    popularity: 70
  },
  
  // Goa
  {
    name: "Goa International Airport",
    code: "GOI",
    type: "airport",
    city: "Panaji",
    state: "Goa",
    coordinates: { latitude: 15.3808, longitude: 73.8314 },
    airportInfo: {
      iataCode: "GOI",
      icaoCode: "VOGO",
      terminals: 1,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal, Departure Hall",
      operatingHours: { start: "05:00", end: "23:00" }
    },
    popularity: 75
  },
  
  // Cochin
  {
    name: "Cochin International Airport",
    code: "COK",
    type: "airport",
    city: "Kochi",
    state: "Kerala",
    coordinates: { latitude: 10.1520, longitude: 76.4019 },
    airportInfo: {
      iataCode: "COK",
      icaoCode: "VOCI",
      terminals: 4,
      international: true
    },
    services: {
      luggageService: true,
      counterLocation: "Terminal 3, International Departure",
      operatingHours: { start: "04:00", end: "24:00" }
    },
    popularity: 78
  }
];

// Function to seed the database
const seedStations = async () => {
  try {
    console.log('🌱 Starting station seeding process...');
    
    // Clear existing stations
    await Station.deleteMany({});
    console.log('🗑️ Cleared existing stations');
    
    // Insert railway stations
    console.log('🚂 Inserting railway stations...');
    const insertedRailways = await Station.insertMany(railwayStations);
    console.log(`✅ Inserted ${insertedRailways.length} railway stations`);
    
    // Insert airports
    console.log('✈️ Inserting airports...');
    const insertedAirports = await Station.insertMany(airports);
    console.log(`✅ Inserted ${insertedAirports.length} airports`);
    
    console.log(`🎉 Successfully seeded ${insertedRailways.length + insertedAirports.length} stations`);
    
    // Create text indexes for better search
    await Station.createIndexes();
    console.log('📊 Created search indexes');
    
    return {
      success: true,
      railwayCount: insertedRailways.length,
      airportCount: insertedAirports.length,
      total: insertedRailways.length + insertedAirports.length
    };
    
  } catch (error) {
    console.error('❌ Error seeding stations:', error);
    throw error;
  }
};

// Function to get seeding stats
const getSeedingStats = async () => {
  try {
    const railwayCount = await Station.countDocuments({ type: 'railway' });
    const airportCount = await Station.countDocuments({ type: 'airport' });
    const totalCount = await Station.countDocuments();
    
    return {
      railways: railwayCount,
      airports: airportCount,
      total: totalCount
    };
  } catch (error) {
    console.error('Error getting seeding stats:', error);
    throw error;
  }
};

module.exports = {
  seedStations,
  getSeedingStats,
  railwayStations,
  airports
};

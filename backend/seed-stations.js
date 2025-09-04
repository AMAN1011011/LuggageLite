const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/travellite';

const stations = [
  {
    name: 'Mumbai Central',
    code: 'MMCT',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'railway',
    location: { lat: 19.0605, lng: 72.8211 }
  },
  {
    name: 'New Delhi',
    code: 'NDLS',
    city: 'Delhi',
    state: 'Delhi',
    type: 'railway',
    location: { lat: 28.6448, lng: 77.2065 }
  },
  {
    name: 'Howrah Junction',
    code: 'HWH',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'railway',
    location: { lat: 22.5958, lng: 88.2636 }
  },
  {
    name: 'Chennai Central',
    code: 'MAS',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'railway',
    location: { lat: 13.0827, lng: 80.2707 }
  },
  {
    name: 'Bangalore City Junction',
    code: 'SBC',
    city: 'Bangalore',
    state: 'Karnataka',
    type: 'railway',
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    name: 'Hyderabad Deccan',
    code: 'HYB',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'railway',
    location: { lat: 17.3850, lng: 78.4867 }
  },
  {
    name: 'Ahmedabad Junction',
    code: 'ADI',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'railway',
    location: { lat: 23.0225, lng: 72.5714 }
  },
  {
    name: 'Pune Junction',
    code: 'PUNE',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'railway',
    location: { lat: 18.5204, lng: 73.8567 }
  },
  {
    name: 'Jaipur Junction',
    code: 'JP',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'railway',
    location: { lat: 26.9124, lng: 75.7873 }
  },
  {
    name: 'Lucknow Junction',
    code: 'LJN',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    type: 'railway',
    location: { lat: 26.8467, lng: 80.9462 }
  }
];

async function seedStations() {
  let client;
  
  try {
    console.log('🌱 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const stationsCollection = db.collection('stations');
    
    // Clear existing stations
    await stationsCollection.deleteMany({});
    console.log('🗑️ Cleared existing stations');
    
    // Insert new stations
    const result = await stationsCollection.insertMany(stations);
    console.log(`✅ Successfully seeded ${result.insertedCount} stations`);
    
    // Display inserted stations
    const insertedStations = await stationsCollection.find({}).toArray();
    console.log('\n📋 Inserted stations:');
    insertedStations.forEach(station => {
      console.log(`  - ${station.name} (${station.code}) - ${station.city}, ${station.state}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding stations:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

seedStations();

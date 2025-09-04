# TravelLite Backend API

## Quick Start

### Option 1: Mock Server (Recommended for Testing)
```bash
# Start the mock API server (no database required)
node mock-api-server.js
```

### Option 2: Full Server (Requires MongoDB)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/travellite
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout (protected)

### Stations
- `GET /api/stations/search?q=mumbai` - Search stations
- `GET /api/stations/popular` - Get popular stations
- `GET /api/stations/distance/:id1/:id2` - Calculate distance
- `GET /api/stations/:id` - Get station details

### Health Check
- `GET /api/health` - Server health status

## Mock Data

The mock server includes:
- 8 major Indian stations (Mumbai, Delhi, Bangalore, Chennai)
- Both railway stations and airports
- Full authentication system with in-memory storage
- Distance calculation between stations

## Testing

Use the mock server for frontend testing without database setup. It provides all the same endpoints as the full server but stores data in memory.

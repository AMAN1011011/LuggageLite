# MongoDB Authentication Setup

## Prerequisites
- MongoDB installed and running on localhost:27017
- Node.js and npm installed

## Setup Steps

### 1. Create Environment File
Create a `.env` file in the backend directory with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/travellite
JWT_SECRET=34144872fecc102808461b95b340c370374933ea3d4e5637be54a64555a1b336e2964753591f7f5292d238ad2dbbbe66a0cc6dc4dd881e34b89c02b14ef56a10
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies
```bash
cd backend
npm install mongodb
```

### 3. Seed Initial Data (Optional)
```bash
node seed-stations.js
```

### 4. Start the Server
```bash
node mongodb-auth-server.js
```

Or use the start script:
```bash
npm run start-dev
```

## Features

### User Authentication
- **Registration**: Create new user accounts with email, password, name, phone, and address
- **Login**: Authenticate users with email and password
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Password Hashing**: Passwords are securely hashed using bcrypt

### User Management
- **Profile Management**: Get and update user profiles
- **Password Change**: Secure password change functionality
- **Logout**: Token-based logout system

### Data Persistence
- **MongoDB Storage**: All user data is stored in MongoDB
- **Indexes**: Optimized database performance with proper indexes
- **Validation**: Server-side data validation and error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Other
- `GET /api/stations` - Get all railway stations

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Comprehensive error handling and logging

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, lowercase),
  password: String (hashed),
  phone: String (unique),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Stations Collection
```javascript
{
  _id: ObjectId,
  name: String,
  code: String,
  city: String,
  state: String,
  type: String,
  location: {
    lat: Number,
    lng: Number
  }
}
```

## Testing

1. Start the server
2. Open your frontend application
3. Try to register a new user
4. Try to login with the registered user
5. Check MongoDB to verify data is being saved

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running on localhost:27017
- Check if the database name 'travellite' exists
- Verify network connectivity

### JWT Issues
- Ensure the JWT_SECRET is properly set in .env
- Check token expiration (default: 7 days)

### CORS Issues
- Frontend should be running on http://localhost:5173
- Check browser console for CORS errors
